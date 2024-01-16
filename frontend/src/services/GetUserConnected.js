import axios from "axios";
import { AUTH_TOKEN_KEY } from "../App";

export async function getUserConnected() {
  const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);
  if (!jwt) {
    console.error("JWT not found");
    return null;
  }
  try {
    const response = await axios.get("/api/users/userConnected", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      // Erreur de réponse du serveur
      throw new Error(`Erreur du serveur: ${error.response.status}`);
    } else if (error.request) {
      // Erreur de requête
      throw new Error("Problème de connexion, veuillez réessayer.");
    } else {
      // Erreur inattendue
      throw new Error(
        "Une erreur inattendue s'est produite, veuillez réessayer.",
      );
    }
  }
}
