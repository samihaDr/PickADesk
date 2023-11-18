import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./RegisterPage.scss";
import { AUTH_TOKEN_KEY } from "../../App";
import axios from "axios";
import { EmailValidator } from "../../services/EmailValidator";
import { PasswordValidator } from "../../services/PasswordValidator";

export default function RegisterPage({ setUserConnected }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    lastname: "",
    firstname: "",
    password: "",
  });

  const [error, setError] = useState("");
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (
      EmailValidator(userData.email) &&
      PasswordValidator(userData.password)
    ) {
      axios
        .post("/api/auth/register", userData)
        .then((response) => {
          const jwt = response.data.token;
          sessionStorage.setItem(AUTH_TOKEN_KEY, jwt);
          axios
            .get("/api/users/userConnected", {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            })
            .then((userInfoResponse) => {
              const userData = userInfoResponse.data;
              console.log("User Info:", userData);

              // Vider les champs du formulaire après une soumission réussie
              //setFormData({ email: "", password: "" });
              setUserConnected(`${userData.firstname} ${userData.lastname}`);
              setError("");
              navigate("/dashboard");
            })
            .catch((userInfoError) => {
              // Gérer les erreurs liées à la récupération des informations utilisateur
              console.error("Error fetching user info:", userInfoError);
            });
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
      setError("Veuillez remplir tous les champs correctement.");
    }
  };
  return (
    <div>
      <card className="card">
        <h2 style={{ color: "#1f4e5f" }}>Register</h2>
        <div className="register-container">
          <div>
            <div className="form-container">
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="InputEmail" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="Email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                  />

                  <div className="mb-3">
                    <label htmlFor="InputLastname" className="form-label">
                      LastName
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="Lastname"
                      name="lastname"
                      value={userData.lastname}
                      onChange={handleChange}
                      aria-describedby="lastnameHelp"
                    />
                    <div id="lastnameHelp" className="form-text">
                      Enter a valid lastname.
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="InputFirstname" className="form-label">
                      FirstName
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="Firstname"
                      name="firstname"
                      value={userData.firstname}
                      onChange={handleChange}
                      aria-describedby="firstnameHelp"
                    />
                    <div id="firstnameHelp" className="form-text">
                      Enter a valid firstname.
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
                      value={userData.password}
                      onChange={handleChange}
                      aria-describedby="passwordHelp"
                    />
                    <div id="passwordHelp" className="form-text">
                      enter a password containing at least 8 letters, a number
                      and a special character.
                    </div>
                  </div>
                </div>
                {/*<div className="mb-3">*/}
                {/*  <label htmlFor="ConfirmPassword" className="form-label">*/}
                {/*    Confirm Password*/}
                {/*  </label>*/}
                {/*  <input*/}
                {/*    type="password"*/}
                {/*    className="form-control"*/}
                {/*    id="ConfirmPassword"*/}
                {/*    onChange={handleChange}*/}
                {/*  />*/}
                {/*</div>*/}
                <button type="submit" className="btn btn-primary">
                  Register
                </button>
              </form>
            </div>
            <div>
              <span>Already have an account? </span>
              <Link to="/loginPage">Log in</Link>
            </div>
            {/* Afficher le message d'erreur */}
            {error && <div style={{ color: "red" }}>{error}</div>}
          </div>
        </div>
      </card>
    </div>
  );
}
