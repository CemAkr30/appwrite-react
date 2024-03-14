import React, { useState, useEffect, useRef } from "react";
import client, {
  databases,
  DATABASE_ID,
  COLLECTION_ID_MESSAGES,
} from "../appwriteConfig.js";
import { ID, Query, Role, Permission } from "appwrite";
import { Trash2 } from "react-feather";
import Header from "../components/Header.jsx";
import { useAuth } from "../utils/AuthContext.jsx";

const Room = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");
  const [greeting, setGreeting] = useState("");
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    // Her mesaj eklendiğinde otomatik olarak aşağı kaydır
    scrollToBottom();
    if (
      new Date().toLocaleTimeString() > "12:00:00" &&
      new Date().toLocaleTimeString() < "18:00:00"
    ) {
      setGreeting("Good Evening 🌆");
    } else if (
      new Date().toLocaleTimeString() > "18:00:00" &&
      new Date().toLocaleTimeString() < "24:00:00"
    ) {
      setGreeting("Good Night 🌙");
    } else if (
      new Date().toLocaleTimeString() > "00:00:00" &&
      new Date().toLocaleTimeString() < "06:00:00"
    ) {
      setGreeting("Good Night 🌙");
    } else if (
      new Date().toLocaleTimeString() > "06:00:00" &&
      new Date().toLocaleTimeString() < "12:00:00"
    ) {
      setGreeting("Good Morning 🌅");
    } else {
      setGreeting("Good Afternoon 🌞");
    }
  }, [messages]);

  useEffect(() => {
    getMessages();

    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
      (response) => {
        console.log("REAL TIME: ", response);

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          console.log("A MESSAGE WAS CREATED");
          setMessages((prevState) => {
            const newState = [response.payload, ...prevState];
            // createAt alanına göre sıralama
            newState.sort(
              (a, b) => new Date(a.$createdAt) - new Date(b.$createdAt)
            );
            scrollToBottom(); // Yeni mesaj geldiğinde scrolu en alta çek
            return newState;
          });
        }

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          console.log("A MESSAGE WAS DELETED!!!");
          setMessages((prevState) => {
            const newState = prevState.filter(
              (message) => message.$id !== response.payload.$id
            );
            scrollToBottom(); // Yeni mesaj geldiğinde scrolu en alta çek
            return newState;
          });
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = {
      user_id: user.$id,
      username: user.name,
      body: messageBody,
    };

    let permissions = [Permission.write(Role.user(user.$id))];

    let response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      ID.unique(),
      payload,
      permissions
    );

    console.log("Created!", response);

    setMessageBody("");
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const lastMessage = messagesContainerRef.current.lastElementChild;
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  };

  const getMessages = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_MESSAGES,
        [Query.orderAsc("$createdAt")]
      );
      setMessages(response.documents);
      console.log("Response", response);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMessage = async (messageId) => {
    databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, messageId);
  };

  return (
    <>
      <main className="container">
        <h1 className="date--greeting" data-text={greeting}>
          {greeting}
        </h1>
        <Header />
        <div className="room--container">
          <div
            style={{ overflowY: "scroll", height: "54vh" }}
            ref={messagesContainerRef}
          >
            <div>
              {messages.map((message) => (
                <div key={message.$id} className="message--wrapper">
                  <div className="message--header">
                    <p>
                      {message?.username ? (
                        <span>{message.username}</span>
                      ) : (
                        <span>Anonymous User</span>
                      )}
                      <small className="message-timestamp">
                        {new Date(message.$createdAt).toLocaleString()}
                      </small>
                    </p>

                    {message.$permissions.includes(
                      `delete(\"user:${user.$id}\")`
                    ) &&
                      new Date(message.$createdAt) > new Date() - 60000 && (
                        <>
                          <Trash2
                            className="delete--btn"
                            onClick={() => {
                              deleteMessage(message.$id);
                            }}
                          />
                        </>
                      )}
                  </div>
                  <div
                    className="message--body"
                    style={
                      user?.name === message.username
                        ? { backgroundColor: "green" }
                        : null
                    }
                  >
                    <span>{message.body}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} id="message-form">
            <div>
              <textarea
                required
                maxLength="1000"
                placeholder="Say something..."
                onChange={(e) => {
                  setMessageBody(e.target.value);
                }}
                value={messageBody}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    document
                      .getElementsByClassName("btn--secondary")[0]
                      .click();
                  }
                }}
              />
            </div>
            <div className="send-btn--wrapper">
              <input
                className="btn btn--secondary"
                type="submit"
                value="Send"
                hidden
              />
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Room;
