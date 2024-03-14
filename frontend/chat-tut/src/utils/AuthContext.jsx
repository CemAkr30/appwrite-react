import { createContext, useState, useEffect, useContext } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUserOnLoad();
  }, []);

  const getUserOnLoad = async () => {
    try {
      const accountDetails = await account.get();
      console.log("accountDetails", accountDetails);
      setUser(accountDetails);
    } catch (err) {
      console.info(err);
    }

    setLoading(false);
  };

  const handleUserLogin = async (e, credentials) => {
    e.preventDefault();
    console.log("Logging in...");

    try {
      const response = await account.createEmailSession(
        credentials.email,
        credentials.password
      );
      console.log("Login successful!", response);
      const accountDetails = await account.get();
      setUser(accountDetails);

      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserLogout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserRegister = async (e, credentials) => {
    e.preventDefault();
    console.log("Registering...");

    if (credentials.password1 !== credentials.password2) {
      alert("Passwords do not match");
      return;
    }

    try {
      let response = await account.create(
        ID.unique(),
        credentials.email,
        credentials.password1,
        credentials.name
      );
      await account.createEmailSession(
        credentials.email,
        credentials.password1
      );
      const accountDetails = await account.get();
      console.log("accountDetails", accountDetails);
      setUser(accountDetails);
      console.log("Registration successful!", response);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const contextData = {
    user,
    handleUserLogin,
    handleUserLogout,
    handleUserRegister,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
