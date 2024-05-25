import { useCallback, useContext } from "react";
import { GlobalContext } from "../../services/GlobalState";
import { AUTH_TOKEN_KEY } from "../../App";
import axios from "axios";


const useCalculateRemaining = () => {
  const { userInfo, setWeeklyRemaining, setWeeklyBookings} = useContext(GlobalContext);

  return useCallback(
    async (userId, date = new Date()) => {
      const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);
      if (!jwt) {
        console.log("No authentication token found. Please login.");
        return;
      }
      const formattedDate = date.toISOString().slice(0,10);
      try {
        const response = await axios.get(
          `/api/reservations/getReservationsForWeek/${userId}/${formattedDate}`,
          {
            headers: { Authorization: `Bearer ${jwt}` },
          },
        );
        console.log("UseCalculateRemaining : ", response.data.reservations);
        if (response.data.reservations ){
            let totalDaysReserved = 0;
            response.data.reservations.forEach((reservation) => {
                if (reservation.morning && reservation.afternoon) {
                    totalDaysReserved += 1;
                } else if (reservation.morning || reservation.afternoon) {
                    totalDaysReserved += 0.5;
                }
            });
            const memberQuota = response.data.memberQuota;
            if (memberQuota !== undefined) {
                const newRemaining = response.data?.memberQuota - totalDaysReserved;
                setWeeklyRemaining(newRemaining);
                setWeeklyBookings(totalDaysReserved);
            } else {
                console.log("No memberQuota found in response.");
                // Gérer l'absence de memberQuota ici.
            }
        } else {
            setWeeklyRemaining(userInfo.memberQuota);
        }

      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      }
    },
    [setWeeklyRemaining, setWeeklyBookings],
  );
};

export default useCalculateRemaining;

