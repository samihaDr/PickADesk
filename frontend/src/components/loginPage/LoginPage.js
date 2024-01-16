import React, { useContext, useState } from "react";
import "./LoginPage.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AUTH_TOKEN_KEY } from "../../App";
import { EmailValidator } from "../../services/EmailValidator";
import { GlobalContext } from "../../services/GlobalState";

export default function LoginPage() {
  const { setUserConnected, setWeeklyQuota, setUserPreferences } =
    useContext(GlobalContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (EmailValidator(formData.email)) {
      setIsLoading(true); // Début du chargement
      axios
        .post("/api/auth/authenticate", formData)
        .then((response) => {
          const jwt = response.data.token;
          sessionStorage.setItem(AUTH_TOKEN_KEY, jwt);
          axios
            .get("/api/users/userConnected", {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            })
            .then(async (userInfoResponse) => {
              const userData = userInfoResponse.data;
              const userId = userData.id;

              // Vider les champs du formulaire après une soumission réussie
              setFormData({ email: "", password: "" });
              setUserConnected(`${userData.firstname} ${userData.lastname}`);

              const userPreferencesResponse = await axios.get(
                `/api/userPreferences/${userId}`,
              );

              const userPreferencesData = userPreferencesResponse.data;
              console.log(
                "USER PREFERENCES IN LOGIN PAGE : ",
                userPreferencesData,
              );
              setUserPreferences(userPreferencesData);

              const teamInfoResponse = await axios.get(
                `/api/teams/getTeamById/${userData.teamId}`,
              );
              const teamInfoData = teamInfoResponse.data;
              console.log("TEamInfoData :   ", teamInfoData);
              setWeeklyQuota(`${teamInfoData.memberQuota}`);
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
        })
        .finally(() => {
          setIsLoading(false); // Fin du chargement
        });
    } else {
      setError("Veuillez donner une adresse mail valide.");
    }
  };
  return (
    <div className="main">
      <h2 style={{ color: "#1f4e5f" }}>Log In</h2>
      {/* ... */}
      {isLoading ? (
        <div>Chargement...</div> // Ou un spinner / indicateur de chargement
      ) : (
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
                  <div id="passwordHelp" className="form-text">
                    We'll never share your password with anyone else.
                  </div>
                </div>
                {/*<div className="mb-3 form-check">*/}
                {/*  <input*/}
                {/*    type="checkbox"*/}
                {/*    className="form-check-input"*/}
                {/*    id="exampleCheck1"*/}
                {/*  />*/}
                {/*  <label className="form-check-label" htmlFor="exampleCheck1">*/}
                {/*    Check me out*/}
                {/*  </label>*/}
                {/*</div>*/}
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
      )}
    </div>
  );
}
