import axios from "axios";
import { AUTH_TOKEN_KEY } from "../App";

export const bookWorkStation = async (reservationDetails, isGroupBooking) => {
  const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);
  if (!jwt) {
    console.error("No authentication token found.");
    return { success: false, message: "Authentication required." };
  }

  let url = isGroupBooking ? "/api/reservations/addGroupReservation" : "/api/reservations/addIndividualReservation";

  console.log("URL used: ", url);
  console.log("Data sent to the server: ", JSON.stringify(reservationDetails, null, 2));

  try {
    const response = await axios.post(url, reservationDetails, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
    console.log("Server response: ", response.data);
    return { success: true, details: response.data };
  } catch (error) {
    console.error("Booking error: ", error);
    console.error("Error details: ", error.response ? error.response.data : "No error data");
    return { success: false, message: error.response ? error.response.data.message : "Failed to book work station." };
  }
};


