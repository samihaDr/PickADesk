import {useContext} from 'react';
import {GlobalContext} from "../../services/GlobalState";
import useCalculateRemaining from "./useCalculateRemaining";
import {AUTH_TOKEN_KEY} from "../../App";
import axios from "axios";

const useDeleteGroupReservation = () => {
    const {userInfo} = useContext(GlobalContext);
    const calculateRemaining = useCalculateRemaining();
    const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);
    return async (managerId, reservationDate) => {
        if (!jwt) {
            console.log("No authentication token found. Please login.");
            return;
        }
        try {
            const response = await axios.delete(`/api/reservations/deleteGroupReservations/${reservationDate}/${managerId}`,
                {
                    headers: {Authorization: `Bearer ${jwt}`},
                },
            );
            if (response.status === 200) {
                await calculateRemaining(userInfo.id);
                console.log("Group reservations deleted successfully.");
            } else {
                console.error("Failed to delete group reservations.");
            }
        } catch (error) {
            console.error("Error deleting group reservations: ", error);
        }
    };
};

export default useDeleteGroupReservation;
