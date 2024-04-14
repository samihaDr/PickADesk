import axios from "axios";
import { AUTH_TOKEN_KEY } from "../App";
import { format } from "date-fns";
import { getUserConnected } from "./GetUserConnected";

export const bookWorkStation = async (stationId, selectedOptions) => {
  const isoDateString = selectedOptions.date;
  const date = new Date(isoDateString);
  const formattedDate = format(date, "yyyy-MM-dd");
  const userData = getUserConnected();

  const reservationDetails = {
    userId: userData.id,
    workStation: { id: stationId },
    reservationDate: formattedDate,
    morning: selectedOptions.timePeriod.morning,
    afternoon: selectedOptions.timePeriod.afternoon,
    reservationTypeId: selectedOptions.reservationType,
  };

  const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);

  if (!jwt) {
    console.error("No authentication token found.");
    return { success: false, message: "Authentication required." };
  }

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
    console.log("ResponseData from Service: ", response.data);
    return { success: true, details: response.data };
  } catch (error) {
    console.error("Booking error :", error);
    return { success: false, message: "Failed to book work station." };
  }
};
