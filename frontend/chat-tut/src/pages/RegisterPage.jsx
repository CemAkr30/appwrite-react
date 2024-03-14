import React, { useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const { handleUserRegister } = useAuth();

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password1: "",
    password2: "",
  });

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
              handleUserRegister(e, credentials);
            }}
          >
            <div className="field--wrapper">
              <label>Name:</label>
              <input
                type="text"
                required
                name="name"
                placeholder="Enter your name..."
                value={credentials.name}
                onChange={handleInputChange}
              />
            </div>
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
                name="password1"
                placeholder="Enter your password..."
                value={credentials.password1}
                onChange={handleInputChange}
              />
            </div>
            <div className="field--wrapper">
              <label>Confirm Password:</label>
              <input
                type="password"
                required
                name="password2"
                placeholder="Confirm your password..."
                value={credentials.password2}
                onChange={handleInputChange}
              />
            </div>

            <div className="field-wrapper">
              <input
                className="btn btn--lg btn--main"
                type="submit"
                value="Register"
              />
            </div>

            <p>
              Already have an account <Link to="/login">here</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
