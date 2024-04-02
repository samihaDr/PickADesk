import { useContext } from "react";
import axios from "axios";
import { GlobalContext } from "../../services/GlobalState";
import { AUTH_TOKEN_KEY } from "../../App";
import useCalculateRemaining from "./useCalculateRemaining";

const useDeleteReservation = () => {
  const { userInfo, setReservations, reservations } = useContext(GlobalContext);
  const calculateRemaining = useCalculateRemaining();
  return async (reservationId) => {
    console.log("reservation deteted :", reservationId);
    const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);
    if (!jwt) {
      console.log("No authentication token found. Please login.");
      return;
    }

    try {
      await axios.delete(
        `/api/reservations/deleteReservation/${reservationId}`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        },
      );
      // Mise à jour de l'état global après suppression
      const updatedReservations = reservations.filter(
        (reservation) => reservation.id !== reservationId,
      );
      setReservations(updatedReservations);
      await calculateRemaining(userInfo.id);
      console.log("Reservations updated :", reservations);
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
    }
  };
};

export default useDeleteReservation;
