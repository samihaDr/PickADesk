import React, {useContext} from "react";
import {GlobalContext} from "../../services/GlobalState";
import "./ReservationDetails.scss";
import {Button, Modal} from "react-bootstrap";
import moment from "moment";
import useDeleteReservation from "../hooks/useDeleteReservation";
import useDeleteGroupReservation from "../hooks/useDeleteGroupReservations";

export default function ReservationDetails({
                                               event,
                                               onDelete,
                                               setShowConfirmationModal,
                                               showConfirmationModal,
                                               show,
                                               onHide,
                                               refreshEvents,
                                           }) {
    const {userInfo, setFavorites} = useContext(GlobalContext);
    const deleteReservation = useDeleteReservation(); // Utilisation du hook
    const deleteGroupReservation = useDeleteGroupReservation();

    if (!userInfo) {
        return <div>Please log in to view booking details.</div>;
    }

    // Vérifiez si l'utilisateur est un manager
    const isManager = userInfo?.role === 'MANAGER';

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

    let reservationTypeName = "";

    switch (event?.reservationTypeId) {
        case 1:
            reservationTypeName = "Individual space";
            break;
        case 2:
            reservationTypeName = "Collaborative space";
            break;
        case 3:
            reservationTypeName = "Team day";
            break;
        default:
            reservationTypeName = "unspecified";
    }
    // fonction qui verifie si la reservation est une reservation groupé
    let isGroupReservation = event?.reservationTypeId === 3;
    // Fonction pour annuler la réservation
    const confirmCancelReservation = async () => {
        if (isReservationPassed) {
            console.log("You cannot cancel a reservation that has already been made.");
            return;
        }

        await deleteReservation(reservationId);
        onHide(); // Ferme la modal après la suppression
        refreshEvents();
    };
    // Fonction pour supprimer une réservation de groupe
    const confirmDeleteGroupReservation = async () => {
        if (isReservationPassed) {
            console.log("You cannot cancel a reservation that has already been made.");
            return;
        }
        if (isManager && isGroupReservation) {
            await deleteGroupReservation(userInfo.id, event.reservationDate); // Utilisez l'ID du manager et la date de réservation
            onHide(); // Fermer la modal après la suppression
            refreshEvents(); // Mettre à jour les événements/réservations affichés
        } else {
            console.log("Unauthorized attempt to delete group reservation.");
        }
    };

    // Fonction pour ajouter le poste aux favoris
    function addToFavorites() {
        const currentWorkStation = {
            id: event?.workStation?.id,
            workPlace: event?.workStation?.workPlace,
            zone: event?.workStation?.zone.name,
            workArea: event?.workStation?.workArea.name,
            screen: event?.workStation?.screen.name,
            equipments: event?.workStation?.equipments
                .map((equipment) => equipment.name)
                .join(", "),
            furnitures: event?.workStation?.furnitures
                .map((furniture) => furniture.name)
                .join(", "),
        };

        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

        const alreadyInFavorites = favorites.some(
            (favorite) => favorite.workPlace === currentWorkStation.workPlace,
        );

        if (!alreadyInFavorites) {
            if (favorites.length >= 5) {
                favorites.shift(); // Supprime le premier élément du tableau
            }
            favorites.push(currentWorkStation);

            localStorage.setItem("favorites", JSON.stringify(favorites));
            setFavorites(favorites);
            alert("Workstation added to favorites.");
        } else {
            alert("This workstation is already in your favorites.");
        }
    }

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
                            <strong>Reservation Type:</strong> {reservationTypeName}
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
                    <br/>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <div>
                        <Button variant="info" onClick={() => addToFavorites()}>
                            Add to favorites
                        </Button>
                    </div>
                    <div>
                        <Button
                            variant="secondary"
                            onClick={() => onHide()}
                            className="ms-2"
                        >
                            Close
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => isGroupReservation ? confirmDeleteGroupReservation() : confirmCancelReservation()}
                            disabled={ (!isManager && isGroupReservation) || isReservationPassed }
                            className="ms-2"
                        >
                            {isGroupReservation ? "Delete All Reservations" : "Delete Reservation"}
                        </Button>
                    </div>
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
