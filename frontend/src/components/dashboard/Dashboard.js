import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AUTH_TOKEN_KEY } from "../../App";
import { GlobalContext } from "../../services/GlobalState";
import "./Dashboard.scss";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { userInfo, isAuthenticated } = useContext(GlobalContext); // Utilisation de isAuthenticated pour vérifier l'état de connexion
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };
  const dateFormatted = new Intl.DateTimeFormat("en-GB", options).format(today);
  const [reservationData, setReservationData] = useState([]);

  // Modification pour utiliser isAuthenticated et récupérer le JWT de sessionStorage au lieu de localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/loginPage"); // Rediriger l'utilisateur vers la page de connexion s'il n'est pas authentifié
      return;
    }
    const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);
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
        } else {
          console.error("Erreur de récupération de la réservation :", message);
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la requête :", error);
      });
  }, [isAuthenticated, navigate]);

  // Affichage conditionnel basé sur userInfo pour saluer l'utilisateur
  const greeting = userInfo ? `Hello, ${userInfo.firstname}` : "Hello";

  // Fonction appelée lorsque l'utilisateur clique sur le bouton
  const handleButtonClick = () => {
    if (reservationData.length > 0) {
      const reservationId = reservationData[0].id; // Prendre l'ID de la première réservation comme exemple
      navigate("/reservationDetails", { state: { reservationId } }); // Passer l'ID via l'état
    } else {
      navigate("/searchWorkStation");
    }
  };

  return (
    <div className="main">
      <h2>My status</h2>
      <br />
      <div className="dashboard-container">
        <div className="date">
          <span>{dateFormatted}</span>
        </div>
        <div className="hello">
          <span>{greeting},</span>
        </div>
        {reservationData.length > 0 ? (
          reservationData.map((reservation, index) => (
            <div key={index}>
              <span>You are working in the office today.</span>
              <br />
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
            You are working remotely (no reservation found for today).
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
