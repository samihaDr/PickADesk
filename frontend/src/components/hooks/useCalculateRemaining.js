import { useCallback, useContext } from "react";
import { GlobalContext } from "../../services/GlobalState";
import { AUTH_TOKEN_KEY } from "../../App";
import axios from "axios";


const useCalculateRemaining = () => {
  const { userInfo, setWeeklyRemaining } = useContext(GlobalContext);

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
            console.log("MemberQuota : ", memberQuota);
            const newRemaining = memberQuota - totalDaysReserved;
            setWeeklyRemaining(newRemaining);
        } else {
            setWeeklyRemaining(userInfo.memberQuota);
        }

      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      }
    },
    [setWeeklyRemaining],
  );
};

export default useCalculateRemaining;
