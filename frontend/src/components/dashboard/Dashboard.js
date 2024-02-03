import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AUTH_TOKEN_KEY } from "../../App";
import { GlobalContext } from "../../services/GlobalState";
import "./Dashboard.scss";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { userConnected } = useContext(GlobalContext);
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const dateFormatted = new Intl.DateTimeFormat("en-US", options).format(today);
  const [reservationData, setReservationData] = useState([]);
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
        if (success) {
          setReservationData(data);
          console.log("ReservationDAta :::51515151 ", reservationData);
        } else {
          console.error("Erreur de récupération de la réservation :", message);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la requête :", error);
      });
  }, []);

  useEffect(() => {
    console.log("ReservationData updated:", reservationData);
  }, [reservationData]); // Cet effet s'exécute chaque fois que reservationData change

  // Fonction appelée lorsque l'utilisateur clique sur le bouton
  const handleButtonClick = () => {
    if (reservationData.length > 0) {
      navigate("/");
    } else {
      navigate("/searchWorkStation");
    }
  };

  if (!userConnected) {
    return null;
  }

  return (
    <div className="main">
      <h2>My status</h2>
      <br />
      <div className="dashboard-container">
        <div className="date">
          <span>{dateFormatted}</span>
        </div>
        <div className="hello">
          <span> Hello, </span>
        </div>
        {reservationData.length > 0 ? (
          reservationData.map((reservation, index) => (
            <div key={index}>
              <span>You are working in the office today.</span>
              <span>
                This <strong>{reservation.morning && "morning "}</strong>
                <strong>
                  {reservation.afternoon &&
                    (reservation.morning ? "and afternoon" : "afternoon")}
                </strong>{" "}
                the desk <strong>{reservation.workStation.workPlace}</strong>,
                is reserved for you.
              </span>
            </div>
          ))
        ) : (
          <span>
            You are working remotely (no reservation found for today){" "}
          </span>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleButtonClick}
        >
          {reservationData.length > 0
            ? "Go to reservation"
            : "Make a reservation"}
        </button>
      </div>
    </div>
  );
}
