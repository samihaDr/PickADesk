import { useEffect } from "react";
import axios from "axios";
import { AUTH_TOKEN_KEY } from "../../App";

const Logout = () => {
  useEffect(() => {
    const logout = async () => {
      try {
        const authToken = sessionStorage.getItem(AUTH_TOKEN_KEY);

        // Assurez-vous que le token existe avant d'envoyer la requête
        if (authToken) {
          // Inclure le token dans l'en-tête "Authorization"
          const headers = { Authorization: `Bearer ${authToken}` };

          // Appeler votre endpoint de déconnexion côté backend avec les en-têtes
          await axios.post("/api/users/logout", null, { headers });

          sessionStorage.removeItem(AUTH_TOKEN_KEY);

          // Rediriger ou effectuer d'autres actions après la déconnexion
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Erreur lors de la déconnexion :", error);
        // Gérer les erreurs de déconnexion
      }
    };

    logout();
  }, []);

  // return (
  //   <div>
  //     <p></p>
  //     {/* Vous pouvez ajouter un indicateur de chargement ou un message ici */}
  //   </div>
  // );
};

export default Logout;
