import React, { useState } from "react";
import "./LoginPage.scss";
import { Link } from "react-router-dom";

export default function LoginPage() {
  let [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Email: ", email);
    console.log("Password: ", password);
  };

  const validateEmail = (newEmail) => {
    if (validateEmailFormat(newEmail)) {
      setEmail(newEmail);
      console.log("Email updated successfully for user with id:");
    } else {
      console.log("Invalid email format");
    }
  };

  function validateEmailFormat(email) {
    // expression régulière pour valider l'adresse e-mail
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // vérification de la validité de l'adresse e-mail
    return emailRegex.test(email);
  }

  return (
    <div>
      <card className="card">
        <h2 style={{ color: "#1f4e5f" }}>Log In</h2>
        <div className="login-container">
          <div>
            <div className="form-container">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="InputEmail"
                    value={email}
                    onChange={(event) => validateEmail(event.target.value)}
                    aria-describedby="emailHelp"
                  />
                  <div id="emailHelp" className="form-text">
                    We'll never share your email with anyone else.
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="Password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck1"
                  />
                  <label className="form-check-label" htmlFor="exampleCheck1">
                    Check me out
                  </label>
                </div>
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </form>
            </div>
            <div>
              <span>Don't have an account? </span>
              <Link to="/registerPage">Register</Link>
            </div>
          </div>
        </div>
      </card>
    </div>
  );
}
