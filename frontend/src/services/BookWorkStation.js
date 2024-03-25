import axios from "axios";
import { format } from "date-fns";
import { AUTH_TOKEN_KEY } from "../App";
import { getUserConnected } from "./GetUserConnected";

export const bookWorkStation = async (stationId, selectedOptions) => {
  const isoDateString = selectedOptions.date;
  const date = new Date(isoDateString);
  const formattedDate = format(date, "yyyy-MM-dd");
  const userData = getUserConnected();

  const reservationDetails = {
    userId: userData.id,
    workStation: { id: stationId }, // Utilisation de l'ID de la station dans un objet workStation
    reservationDate: formattedDate,
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
    }
  } else {
    console.log("No authentication token found.");
    throw new Error("No authentication token found.");
  }
};
