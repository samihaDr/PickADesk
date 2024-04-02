import { useCallback, useContext } from "react";
import { GlobalContext } from "../../services/GlobalState";
import { AUTH_TOKEN_KEY } from "../../App";
import axios from "axios";

const QUOTA = 2.5;

const useCalculateRemaining = () => {
  const { setWeeklyRemaining } = useContext(GlobalContext);

  return useCallback(
    async (userId) => {
      const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);
      if (!jwt) {
        console.log("No authentication token found. Please login.");
        return;
      }

      try {
        const response = await axios.get(
          `/api/reservations/getReservationsForWeek/${userId}`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
          },
        );
        let totalDaysReserved = 0;
        response.data.data.forEach((reservation) => {
          if (reservation.morning && reservation.afternoon) {
            totalDaysReserved += 1;
          } else if (reservation.morning || reservation.afternoon) {
            totalDaysReserved += 0.5;
          }
        });
        const newRemaining = QUOTA - totalDaysReserved;
        setWeeklyRemaining(newRemaining);
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      }
    },
    [setWeeklyRemaining],
  );
};

export default useCalculateRemaining;
