import React, { useContext } from "react";
import { GlobalContext } from "../../services/GlobalState";
import "./ReservationDetails.scss";
import { Button, Modal } from "react-bootstrap";

export default function ReservationDetails({
  event,
  onModify,
  onDelete,
  show,
  onHide,
}) {
  const { userInfo } = useContext(GlobalContext);

  // Affichage conditionnel en cas d'utilisateur non connecté
  if (!userInfo) return <div>Please log in to view booking details.</div>;

  // Formatage de la date
  const formattedDate = event?.reservationDate
    ? new Date(event.reservationDate).toLocaleDateString("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";
  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
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
          <Button variant="secondary" onClick={() => onModify(event)}>
            Modify
          </Button>
          <Button variant="danger" onClick={() => onDelete(event)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
