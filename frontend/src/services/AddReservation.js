import axios from "axios";
import { format } from "date-fns"; // Importez format de date-fns
import { AUTH_TOKEN_KEY } from "../App";
import { getUserConnected } from "./GetUserConnected";

export const bookWorkStation = async (stationId, selectedOptions) => {
  // Utilisez selectedOptions.date pour obtenir la date ISO et la convertir
  const isoDateString = selectedOptions.date; // Utilisez la date fournie par selectedOptions
  const date = new Date(isoDateString);
  const formattedDate = format(date, "yyyy-MM-dd"); // Formatez la date
  const userData = getUserConnected();

  // Incluez la date formatée dans reservationDetails
  const reservationDetails = {
    userId: userData.id,
    workStation: { id: stationId }, // Utilisation de l'ID de la station dans un objet workStation
    reservationDate: formattedDate, // Utilisez la date formatée ici
    morning: selectedOptions.timePeriod.morning,
    afternoon: selectedOptions.timePeriod.afternoon,
    reservationTypeId: selectedOptions.reservationType,
  };

  const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY); // Récupération du jeton stocké

  if (jwt) {
    try {
      // Utilisation de async/await pour attendre la réponse de l'appel Axios
      const response = await axios.post(
        "/api/reservations/addReservation",
        reservationDetails,
        {
          headers: {
            Authorization: `Bearer ${jwt}`, // Inclusion du jeton dans les en-têtes
          },
        },
      );
      return response.data; // Retourne les données de la réponse pour une utilisation ultérieure
    } catch (error) {
      console.error("Erreur lors de la réservation :", error);
      throw error; // Propagation de l'erreur pour gestion ultérieure
    }
  } else {
    console.log("Aucun jeton d'authentification trouvé");
    // Vous pouvez choisir de gérer ce cas comme une erreur, par exemple en lançant une exception
    throw new Error("Aucun jeton d'authentification trouvé.");
  }
};
