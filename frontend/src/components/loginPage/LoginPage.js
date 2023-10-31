import React, { useState } from "react";
import "./LoginPage.scss";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailInput, setEmailInput] = useState(""); // État intermédiaire sinon mon champs est toujours invalide

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmailInput(newEmail); // Mettre à jour l'état intermédiaire
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateEmailFormat(emailInput)) {
      setEmail(emailInput); // Mettre à jour l'e-mail si valide

      console.log("Email: ", emailInput);
      console.log("Password: ", password);
      setEmailInput(""); // Réinitialisez le champ emailInput
      setPassword(""); // Réinitialisez le champ password
    } else {
      console.log("Invalid email format");
    }
  };

  function validateEmailFormat(input) {
    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(input);
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
                    value={emailInput}
                    onChange={handleEmailChange}
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
