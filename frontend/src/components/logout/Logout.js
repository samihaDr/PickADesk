import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "../../services/GlobalState";

export const AUTH_TOKEN_KEY = "jhi-authenticationToken";

const LogoutButton = () => {
  const navigate = useNavigate();
  const {
    setUserConnected,
    setUserPreferences,
    setIsAuthenticated,
    setUserInfo,
    setWeeklyQuota,
  } = useContext(GlobalContext);
  const logout = async () => {
    try {
      const authToken = sessionStorage.getItem(AUTH_TOKEN_KEY);

      if (authToken) {
        const headers = { Authorization: `Bearer ${authToken}` };

        await axios.post("/api/users/logout", null, { headers });
        setIsAuthenticated(false);
        setUserPreferences([]);
        setUserConnected(null);
        setUserInfo([]);
        setWeeklyQuota(null);
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        sessionStorage.removeItem("weeklyQuota");
        sessionStorage.removeItem("userInfo");
        sessionStorage.removeItem("userPreferences");
        sessionStorage.removeItem("isAuthenticated");

        // Redirection et rechargement de la page
        navigate("/login", { replace: true });
        window.location.reload();
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <button className="nav-link" onClick={logout}>
      Logout
    </button>
  );
};
export default LogoutButton;
