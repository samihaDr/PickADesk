import React, { useState } from "react";
import "./LoginPage.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import { AUTH_TOKEN_KEY } from "../../App";
import { EmailValidator } from "../../services/EmailValidator";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (EmailValidator(formData.email)) {
      axios
        .post("/api/auth/authenticate", formData)
        .then((response) => {
          const bearerToken = response?.headers?.authorization;
          if (bearerToken && bearerToken.slice(0, 7) === "Bearer ") {
            const jwt = bearerToken.slice(7, bearerToken.length);
            sessionStorage.setItem(AUTH_TOKEN_KEY, jwt);
          }
        })
        .catch((error) => {
          if (error.response) {
            // La requête a reçu une réponse du serveur, vous pouvez accéder au statut HTTP ici
            console.error("Erreur HTTP :", error.response.status);
          } else if (error.request) {
            // La requête a été faite, mais aucune réponse n'a été reçue (peut être dû à un problème de connexion)
            console.error(
              "La requête a été faite mais aucune réponse n'a été reçue.",
            );
          } else {
            // Une erreur inattendue s'est produite
            console.error("Erreur inattendue :", error.message);
          }
        });
    }
    setFormData({ email: "", password: "" });
  };

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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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
