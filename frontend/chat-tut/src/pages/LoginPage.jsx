import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const { user, handleUserLogin } = useAuth();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    console.log(credentials);
  };
  return (
    <>
      <div className="auth--container">
        <div className="form-wrapper">
          <form
            onSubmit={(e) => {
              handleUserLogin(e, credentials);
            }}
          >
            <div className="field--wrapper">
              <label>Email:</label>
              <input
                type="email"
                required
                name="email"
                placeholder="Enter your email..."
                value={credentials.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="field--wrapper">
              <label>Password:</label>
              <input
                type="password"
                required
                name="password"
                placeholder="Enter your password..."
                value={credentials.password}
                onChange={handleInputChange}
              />
            </div>
            <br />
            <div className="field-wrapper">
              <input
                className="btn btn--lg btn--main"
                type="submit"
                value="Login"
              />
            </div>

            <br />
            <p
              style={{
                fontSize: "1.5rem",
                fontFamily: "sans-serif",
                fontStyle: "italic",
              }}
            >
              Don't have an account <Link to="/register">here</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
