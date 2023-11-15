import React, { useState } from "react";
import "./LoginPage.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import { AUTH_TOKEN_KEY } from "../../App";
import { EmailValidator } from "../../services/EmailValidator";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "" });
  const [error, setError] = useState("");
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
          const jwt = response.data.token;
          sessionStorage.setItem(AUTH_TOKEN_KEY, jwt);
          // Vider les champs du formulaire après une soumission réussie
          setFormData({ email: "", password: "" });
          setError("");
        })
        .catch((error) => {
          if (error.response) {
            setError(`Erreur du serveur: ${error.response.status}`);
          } else if (error.request) {
            setError("Problème de connexion, veuillez réessayer.");
          } else {
            setError(
              "Une erreur inattendue s'est produite, veuillez réessayer.",
            );
          }
        });
    } else {
      setError("Veuillez donner une adresse mail valide.");
    }
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
            {/* Afficher le message d'erreur */}
            {error && <div style={{ color: "red" }}>{error}</div>}
          </div>
        </div>
      </card>
    </div>
  );
}
