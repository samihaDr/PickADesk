import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../services/GlobalState"; // Assurez-vous que le chemin d'importation est correct
import "./ReservationDetails.scss";
import { AUTH_TOKEN_KEY } from "../../App";
export default function ReservationDetails() {
  const { reservationId } = useLocation().state || {};
  const navigate = useNavigate();
  const { userInfo } = useContext(GlobalContext);
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState(""); // État pour stocker le message d'erreur

  useEffect(() => {
    async function fetchReservation() {
      if (reservationId && userInfo) {
        try {
          const response = await axios.get(
            `/api/reservations/getReservation/${reservationId}`,
          );
          const { success, message, data } = response.data;
          if (success) {
            setReservation(data);
          } else {
            setError(message || "Erreur de récupération de la réservation.");
          }
        } catch (error) {
          setError(
            error.response?.data?.message || "Erreur lors de la requête.",
          );
        }
      }
    }

    fetchReservation();
  }, [reservationId, userInfo]);

  // Fonction pour annuler la réservation
  const cancelReservation = async () => {
    const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);
    try {
      const response = await axios.delete(
        `/api/reservations/deleteReservation/${reservationId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );
      const { success, message } = response.data;
      if (success) {
        alert("Reservation cancelled successfully."); // Affichage d'un message de confirmation
        navigate("/reservations"); // Redirige vers la page de liste des réservations ou une autre page de votre choix
      } else {
        setError(message || "Unable to cancel reservation.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred while trying to cancel the reservation.",
      );
    }
  };
  if (!userInfo)
    return (
      <div>
        Veuillez vous connecter pour voir les détails de la réservation.
      </div>
    );
  if (error) return <div className="error-message">{error}</div>; // Affichage conditionnel de l'erreur
  if (!reservation)
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  // Utilisation de l'opérateur de coalescence optionnelle pour éviter les erreurs
  const formattedDate = reservation?.reservationDate
    ? new Date(reservation.reservationDate).toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";
  return (
    <div className="main">
      <h2>Reservation Details</h2>
      <div className="reservation-details">
        {/*<p>*/}
        {/*  <strong>ID de la réservation :</strong> {reservation.id}*/}
        {/*</p>*/}
        <p>
          <strong>ReservationDate :</strong> {formattedDate}
        </p>
        <p>
          <strong>Session :</strong> {reservation.morning ? "Morning" : ""}{" "}
          {reservation.afternoon ? "Afternoon" : ""}
        </p>
        <p>
          <strong>WorkStation :</strong> {reservation.workStation.workPlace}
        </p>
        <p>
          <strong>Zone :</strong> {reservation.workStation.zone.name}
        </p>
        <p>
          <strong>WorkArea :</strong> {reservation.workStation.workArea.name}
        </p>
        <p>
          <strong>Screen :</strong> {reservation.workStation.screen.name}
        </p>
        <p>
          <strong>Equipments :</strong>{" "}
          {reservation.workStation.equipments
            .map((equipment) => equipment.name)
            .join(", ")}
        </p>
        <p>
          <strong>Furniture :</strong>{" "}
          {reservation.workStation.furnitures
            .map((furniture) => furniture.name)
            .join(", ")}
        </p>
      </div>
      <button className="btn btn-danger" onClick={cancelReservation}>
        Cancel Reservation
      </button>
    </div>
  );
}
