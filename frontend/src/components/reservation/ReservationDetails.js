import React, { useContext } from "react";
import { GlobalContext } from "../../services/GlobalState";
import "./ReservationDetails.scss";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { AUTH_TOKEN_KEY } from "../../App";

export default function ReservationDetails({
  event,
  onModify,
  onDelete,
  setShowConfirmationModal,
  showConfirmationModal,
  show,
  onHide,
}) {
  const { userInfo } = useContext(GlobalContext);
  const reservationId = event?.id ? event.id : event?.resource;
  console.log("ReservationId : ", reservationId);
  const reservationDateTime = new Date(event.reservationDate);
  const now = new Date();

  // Vérifier si la réservation est passée
  const isReservationPassed = reservationDateTime < now;

  const modalStyle = {
    backgroundColor: event.color,
    color:
      event.color === "#f3d3a4" || event.color === "#8ab48a"
        ? "black"
        : "white",
  };
  if (!userInfo) return <div>Please log in to view booking details.</div>;

  const formattedDate = event?.reservationDate
    ? new Date(event.reservationDate).toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  // Fonction pour annuler la réservation
  const confirmCancelReservation = async () => {
    const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);
    if (!jwt) {
      console.log("No authentication token found. Please login.");
      return;
    }
    const reservationDateTime = new Date(event.reservationDate);
    const now = new Date();

    if (reservationDateTime < now) {
      console.log("Vous ne pouvez pas annuler une réservation passée.");
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
      onHide(true);
      window.location.reload();
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
      // Ici, vous pouvez afficher l'erreur dans la modal ou d'une autre manière
    }
  };
  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton style={modalStyle}>
          <Modal.Title id="contained-modal-title-vcenter">
            Reservation Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="reservation-details">
            <div className="item">
              <strong>ReservationDate :</strong> {formattedDate}
            </div>
            <div className="item">
              <strong>Session :</strong> {event?.morning ? "Morning" : ""}{" "}
              {event?.afternoon ? "Afternoon" : ""}{" "}
            </div>
            <div className="item">
              <strong>WorkStation :</strong> {event?.workStation?.workPlace}
            </div>
            <div className="item">
              <strong>Zone :</strong> {event?.workStation?.zone.name}
            </div>
            <div className="item">
              <strong>WorkArea :</strong> {event?.workStation?.workArea.name}
            </div>
            <div className="item">
              <strong>Screen :</strong> {event?.workStation.screen.name}
            </div>
            <div className="item">
              <strong>Equipments :</strong>{" "}
              {event?.workStation.equipments
                .map((equipment) => equipment.name)
                .join(", ")}
            </div>
            <div className="item">
              <strong>Furniture :</strong>{" "}
              {event?.workStation.furnitures
                .map((furniture) => furniture.name)
                .join(", ")}
            </div>
          </div>
          <br />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => onModify(event)}
            disabled={isReservationPassed}
          >
            Modify
          </Button>
          <Button
            variant="danger"
            onClick={() => onDelete(event)}
            disabled={isReservationPassed}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
      >
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
                setShowConfirmationModal(false); // Fermez la modal après la confirmation
              }}
            >
              Yes, Cancel It
            </Button>
            <Button
              variant="secondary"
              className="flex-grow-1 me-2"
              onClick={() => setShowConfirmationModal(false)}
            >
              No
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
