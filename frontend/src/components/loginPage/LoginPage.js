import React, { useContext, useState } from "react";
import "./LoginPage.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AUTH_TOKEN_KEY } from "../../App";
import { EmailValidator } from "../../services/EmailValidator";
import { GlobalContext } from "../../services/GlobalState";

export default function LoginPage() {
  const {
    userConnected,
    setUserConnected,
    weeklyQuota,
    setWeeklyQuota,
    userPreferences,
    setUserPreferences,
  } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const authenticateUser = async (jwt) => {
    try {
      const userInfoResponse = await axios.get("/api/users/userConnected", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      console.log("UserInfoResponse : ", userInfoResponse.data);
      return userInfoResponse.data;
    } catch (error) {
      throw new Error("Error fetching user info");
    }
  };

  const getUserPreferences = async (userId) => {
    const userPreferencesResponse = await axios.get(
      `/api/userPreferences/${userId}`,
    );
    console.log("UserPreferencesResponse : ", userPreferencesResponse.data);
    return userPreferencesResponse.data;
  };

  const getTeamInfo = async (teamId) => {
    const teamInfoResponse = await axios.get(
      `/api/teams/getTeamById/${teamId}`,
    );
    console.log("TeamInfoResponse : ", teamInfoResponse.data);
    return teamInfoResponse.data;
  };

  const handleAuthenticationError = (error) => {
    if (error.response) {
      setError(`Erreur du serveur: ${error.response.status}`);
    } else if (error.request) {
      setError("Problème de connexion, veuillez réessayer.");
    } else {
      setError("Une erreur inattendue s'est produite, veuillez réessayer.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!EmailValidator(formData.email)) {
      setError("Veuillez donner une adresse mail valide.");
      return;
    }

    setIsLoading(true);
    try {
      const authResponse = await axios.post("/api/auth/authenticate", formData);
      const jwt = authResponse.data.token;
      sessionStorage.setItem(AUTH_TOKEN_KEY, jwt);

      const userData = await authenticateUser(jwt);
      setUserConnected(`${userData.firstname} ${userData.lastname}`);
      console.log("UserConnected : ", userConnected);

      const userPreferencesData = await getUserPreferences(userData.id);
      setUserPreferences(userPreferencesData);
      console.log("User Preferences : ", userPreferences);

      const teamInfoData = await getTeamInfo(userData.teamId);
      setWeeklyQuota(`${teamInfoData.memberQuota}`);
      console.log("WeeklyQuota : ", weeklyQuota);

      navigate("/dashboard");
    } catch (error) {
      handleAuthenticationError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <h2 style={{ color: "#1f4e5f" }}>Log In</h2>
      <div className="login-container">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="InputEmail" className="form-label">
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
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
        </div>
        <div>
          <span>Don't have an account? </span>
          <Link to="/registerPage">Register</Link>
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    </div>
  );
}
