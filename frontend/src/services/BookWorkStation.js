import axios from "axios";
import { format } from "date-fns"; // Importez format de date-fns
import { AUTH_TOKEN_KEY } from "../App";
import { getUserConnected } from "./GetUserConnected";

export const bookWorkStation = async (stationId, selectedOptions) => {
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

  const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);

  if (jwt) {
    try {
      const response = await axios.post(
        "/api/reservations/addReservation",
        reservationDetails,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Booking error :", error);
      throw error; // Propagation de l'erreur pour gestion ultérieure
    }
  } else {
    console.log("No authentication token found.");
    // Vous pouvez choisir de gérer ce cas comme une erreur, par exemple en lançant une exception
    throw new Error("No authentication token found.");
  }
};
