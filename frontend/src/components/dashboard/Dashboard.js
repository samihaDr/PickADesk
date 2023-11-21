import React, { useEffect, useState } from "react";
import axios from "axios";
import { AUTH_TOKEN_KEY } from "../../App";

export default function Dashboard() {
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const dateFormatted = new Intl.DateTimeFormat("en-US", options).format(today);
  const [reservationData, setReservationData] = useState({
    id: "",
    reservationDate: "",
    nbTimeSlot: "",
    workStationId: "",
  });
  useEffect(() => {
    const jwt = localStorage.getItem(AUTH_TOKEN_KEY);
    axios
      .get("/api/reservations/hasReservationToday", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        const { success, message, data } = response.data;
        //const reservationDataFromServer = response.data;
        if (success) {
          setReservationData(data);
        } else {
          // Gérez les erreurs ou les messages d'échec ici
          console.error("Erreur de récupération de la réservation :", message);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la requête :", error);
      });
  }, []);

  return (
    <div className="card">
      <h2 style={{ color: "#1f4e5f" }}>My status</h2>
      <div className="dashboard-container">
        <div className="date">
          <p>{dateFormatted}</p>
        </div>
        {reservationData.id ? (
          <div className="content">
            <p>You are working in the office today.</p>
            <p>
              The desk number{" "}
              <strong color={"#1f4e5f"}>
                {" "}
                {reservationData.workStationId}{" "}
              </strong>{" "}
              is reserved for you
            </p>
            <p>
              You still have{" "}
              <strong color={"#1f4e5f"}>{reservationData.nbTimeSlot} </strong>{" "}
              slots
            </p>
          </div>
        ) : (
          <div className="content">
            <p>You are working remotely today.</p>
            <p>You still have {reservationData.nbTimeSlot} telework slots</p>
          </div>
        )}
        <button type="submit" className="btn btn-primary">
          Change your status
        </button>
      </div>
    </div>
  );
}
