import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AUTH_TOKEN_KEY = "jhi-authenticationToken";

const LogoutButton = ({ setUserConnected }) => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const authToken = sessionStorage.getItem(AUTH_TOKEN_KEY);

      if (authToken) {
        const headers = { Authorization: `Bearer ${authToken}` };

        await axios.post("/api/users/logout", null, { headers });

        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        setUserConnected(null);
        navigate("/");
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      // Gérer les erreurs de déconnexion
    }
  };

  // useEffect(() => {
  //   logout();
  // }, []);

  return (
    <button className="nav-link" onClick={logout}>
      Logout
    </button>
  );
};
export default LogoutButton;
