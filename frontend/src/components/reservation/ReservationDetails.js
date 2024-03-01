import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../services/GlobalState"; // Assurez-vous que le chemin d'importation est correct
import "./ReservationDetails.scss";
import { AUTH_TOKEN_KEY } from "../../App";
import { Button, Modal } from "react-bootstrap";

export default function ReservationDetails() {
  const { reservationId } = useLocation().state || {};
  const navigate = useNavigate();
  const { userInfo } = useContext(GlobalContext);
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState(""); // État pour stocker le message d'erreur
  const [showModal, setShowModal] = useState(false);

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
  const confirmCancelReservation = async () => {
    const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);
    if (!jwt) {
      console.log(
        "Aucun jeton d'authentification trouvé. Veuillez vous connecter.",
      );
      return;
    }

    try {
      await axios.delete(
        `/api/reservations/deleteReservation/${reservationId}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );
      navigate("/CurrentReservations"); // Redirection
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
      // Ici, vous pouvez afficher l'erreur dans la modal ou d'une autre manière
    }
  };

  const handleCancelClick = () => {
    setShowModal(true); // Affichez la modal de confirmation au lieu de supprimer directement
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  if (!userInfo) return <div>Please log in to view booking details.</div>;
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
    ? new Date(reservation.reservationDate).toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      })
    : "N/A";
  return (
    <>
      <div className="main">
        <h2>Reservation Details</h2>
        <div className="reservation-details">
          <div className="item">
            <strong>ReservationDate :</strong> {formattedDate}
          </div>
          <div className="item">
            <strong>Session :</strong> {reservation.morning ? "Morning" : ""}{" "}
            {reservation.afternoon ? "Afternoon" : ""}
          </div>
          <div className="item">
            <strong>WorkStation :</strong> {reservation.workStation.workPlace}
          </div>
          <div className="item">
            <strong>Zone :</strong> {reservation.workStation.zone.name}
          </div>
          <div className="item">
            <strong>WorkArea :</strong> {reservation.workStation.workArea.name}
          </div>
          <div className="item">
            <strong>Screen :</strong> {reservation.workStation.screen.name}
          </div>
          <div className="item">
            <strong>Equipments :</strong>{" "}
            {reservation.workStation.equipments
              .map((equipment) => equipment.name)
              .join(", ")}
          </div>
          <div className="item">
            <strong>Furniture :</strong>{" "}
            {reservation.workStation.furnitures
              .map((furniture) => furniture.name)
              .join(", ")}
          </div>
        </div>
        <br />
        <button className="btn btn-danger" onClick={handleCancelClick}>
          Cancel Reservation
        </button>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel this reservation?
        </Modal.Body>
        <Modal.Footer>
          <div className="w-100 d-flex justify-content-between">
            <Button
              variant="primary"
              className="flex-grow-1 me-5"
              onClick={() => {
                confirmCancelReservation();
                handleCloseModal(); // Fermez la modal après la confirmation
              }}
            >
              Yes, Cancel It
            </Button>
            <Button
              variant="secondary"
              className="flex-grow-1 me-2"
              onClick={handleCloseModal}
            >
              No
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
