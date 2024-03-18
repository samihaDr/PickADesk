import React, { useContext } from "react";
import { GlobalContext } from "../../services/GlobalState";
import "./ReservationDetails.scss";
import { Button, Modal } from "react-bootstrap";
import moment from "moment";
import useDeleteReservation from "../hooks/useDeleteReservation";

export default function ReservationDetails({
  event,
  onDelete,
  setShowConfirmationModal,
  showConfirmationModal,
  show,
  onHide,
  refreshEvents,
}) {
  const { userInfo } = useContext(GlobalContext);
  const deleteReservation = useDeleteReservation(); // Utilisation du hook

  if (!userInfo) {
    return <div>Please log in to view booking details.</div>;
  }

  const reservationId = event?.id || event?.resource;
  const formattedDate = event?.reservationDate
    ? moment(event.reservationDate).format("dddd, D MMMM YYYY")
    : "N/A";
  // Déterminez si la réservation est considérée comme passée
  const now = moment();
  const reservationDate = moment(event.reservationDate);
  const isReservationToday = reservationDate.isSame(now, "day");
  const isAfter18h = now.hours() >= 18;
  const isReservationPassed =
    reservationDate.isBefore(now, "day") || (isReservationToday && isAfter18h);

  const modalStyle = {
    backgroundColor: event.color,
    color: ["#44d095", "#ADD8E6", "#FFEF4F"].includes(event.color)
      ? "black"
      : "#1f4e5f",
  };

  // Fonction pour annuler la réservation
  const confirmCancelReservation = async () => {
    if (isReservationPassed) {
      console.log("Vous ne pouvez pas annuler une réservation passée.");
      return;
    }
    await deleteReservation(reservationId);
    onHide(); // Ferme la modal après la suppression
    refreshEvents();
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
          <Button variant="secondary" onClick={() => onHide()}>
            Close
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
