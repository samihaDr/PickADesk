import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AUTH_TOKEN_KEY } from "../../App";
import { GlobalContext } from "../../services/GlobalState";
import "./Dashboard.scss";
import { useNavigate } from "react-router-dom";
import ReservationDetails from "../reservation/ReservationDetails";
import moment from "moment/moment";

export default function Dashboard() {
  const navigate = useNavigate();
  const { userInfo, isAuthenticated } = useContext(GlobalContext);
  const today = new Date();
  const tomorrow = moment().add(1, "days").toDate();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };
  const dateFormatted = new Intl.DateTimeFormat("en-GB", options).format(today);
  const dateFormattedTomorrow = new Intl.DateTimeFormat(
    "en-GB",
    options,
  ).format(tomorrow);
  const [reservationData, setReservationData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const isAfter18h = today.getHours() >= 18;
  const isWeekend = today.getDay() === 0 || today.getDay() === 6;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/loginPage");
      return;
    }
    const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);

    let queryUrl = "/api/reservations/hasReservationToday";
    if (isAfter18h) {
      queryUrl = "/api/reservations/hasReservationTomorrow";
    }
    axios
      .get(queryUrl, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        const { success, data } = response.data;
        if (success) {
          setReservationData(data);
        } else {
          console.error("Erreur de récupération de la réservation.");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la requête :", error);
      });
  }, [isAuthenticated, navigate]);

  const greeting = userInfo ? `Hello, ${userInfo.firstname}` : "Hello";

  const handleButtonClick = () => {
    if (reservationData.length > 0) {
      setSelectedReservation(reservationData[0]);
      console.log(
        "SelectedReservation dans HandleButtonClick: ",
        selectedReservation,
      );
      setShowModal(true);
    } else {
      navigate("/searchWorkStation");
    }
  };

  useEffect(() => {
    console.log("selectedReservation updated:", selectedReservation);
  }, [selectedReservation]);

  const closeModal = () => setShowModal(false);

  return (
    <>
      <div className="main">
        <h2>My status</h2>
        <br />
        <div className="dashboard-container">
          <div className="date">
            <span>{isAfter18h ? dateFormattedTomorrow : dateFormatted}</span>
          </div>
          <div className="hello">
            <span>{greeting},</span>
          </div>
          {isWeekend && !isAfter18h ? (
            <div className="special-message">Enjoy your weekend!</div>
          ) : reservationData.length > 0 ? (
            reservationData.map((reservation, index) => (
              <div key={index}>
                <span>{isAfter18h ? "Tomorrow, " : "Today, "}</span>
                <span>you are working in the office. </span>
                <br />
                <span>
                  This <strong>{reservation.morning && "morning "}</strong>
                  <strong>
                    {reservation.afternoon &&
                      (reservation.morning ? "and afternoon " : "afternoon ")}
                  </strong>
                  the desk <strong>{reservation.workStation.workPlace}</strong>,
                  is reserved for you.
                </span>
              </div>
            ))
          ) : (
            <span>
              {isAfter18h
                ? "You are working remotely tomorrow (no reservation found for tomorrow)."
                : "You are working remotely today (no reservation found for today)."}
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
        {/* Affichage conditionnel du modal basé sur showModal et selectedReservation */}
        {showModal && selectedReservation && (
          <ReservationDetails
            show={showModal}
            onHide={closeModal}
            event={selectedReservation}
            onDelete={() => setShowConfirmationModal(true)} // Mise à jour pour afficher le modal de confirmation
            showConfirmationModal={showConfirmationModal}
            setShowConfirmationModal={setShowConfirmationModal}
          />
        )}
      </div>
    </>
  );
}
