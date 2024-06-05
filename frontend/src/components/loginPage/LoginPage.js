import React, { useContext, useState } from "react";
import "./LoginPage.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AUTH_TOKEN_KEY } from "../../App";
import { EmailValidator } from "../../services/EmailValidator";
import { GlobalContext } from "../../services/GlobalState";
import notify from "../../services/toastNotifications";

export default function LoginPage() {
  const {
    userConnected,
    setUserConnected,
    setUserInfo,
    setIsAuthenticated,
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
      return userInfoResponse.data;
    } catch (error) {
     // throw new Error("Error fetching user info");
      notify.error(error);
    }
  };

  const getUserPreferences = async (userId) => {
    const userPreferencesResponse = await axios.get(
      `/api/userPreferences/${userId}`,
    );
    return userPreferencesResponse.data;
  };

  const handleAuthenticationError = (error) => {
    let errorMessage = "";

    if (error.response) {
      errorMessage = `Server error: ${error.response.status} - Incorrect login or password, please try again.`;
    } else if (error.request) {
      errorMessage = "Connection problem, please try again";
    } else {
      errorMessage = "An unexpected error has occurred, please try again.";
    }

    setError(errorMessage);
    notify.error(errorMessage);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!EmailValidator(formData.email)) {
      let errorMessage = "";
      errorMessage = "Please provide a valid e-mail address.";
      notify.error(errorMessage);
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
      const userInfo = {
        id: userData.id,
        email: userData.email,
        lastname: userData.lastname,
        firstname: userData.firstname,
        role: userData.role,
        teamId: userData.teamId,
        workSchedule: userData.workSchedule,
        memberQuota: userData.memberQuota,
        locked: userData.locked,
        enabled: userData.enabled,
      };
      setUserInfo(userInfo);
      setIsAuthenticated(true);

      const userPreferencesData = await getUserPreferences(userData.id);
      setUserPreferences(userPreferencesData);

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
    <>
      <div className="main">
        <h2>Log In</h2>
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
            <span><strong>Contact HR service</strong></span>
            {/*<Link to="/HomePage">Contact HR service</Link>*/}
          </div>
        </div>
      </div>
    </>
  );
}
