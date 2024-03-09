import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ReservationDetails from "../reservation/ReservationDetails";

const localizer = momentLocalizer(moment);
const AgendaEvent = ({ event }) => {
  return (
    <div>
      <span>WorkPlace n° {event.workPlace}</span>
    </div>
  );
};

function MyCalendar({ events }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const threeMonthsAgo = moment().subtract(3, "months").toDate();
  const minTime = new Date();

  minTime.setHours(7, 0, 0);

  const maxTime = new Date();
  maxTime.setHours(19, 0, 0);

  const eventPropGetter = (event, start) => {
    const eventStart = new Date(event.start);
    const now = new Date();
    const startHour = new Date(start).getHours();
    let newStyle = {
      backgroundColor: "#3174ad",
      color: "white",
      borderRadius: "0px",
      border: "none",
    };

    if (startHour < 12) {
      newStyle.backgroundColor = "#f0ad4e";
    } else {
      newStyle.backgroundColor = "#5cb85c";
    }

    if (eventStart < now && startHour < 12) {
      newStyle.backgroundColor = "#f3d3a4"; // Couleur pour les événements passés grisées
    } else if (eventStart < now && startHour > 12) {
      newStyle.backgroundColor = "#709170";
    }

    return {
      style: newStyle,
    };
  };

  const onNavigate = (newDate, view, action) => {
    if (action === "PREV" && moment(newDate).isBefore(threeMonthsAgo, "day")) {
      return; // Empêche la navigation si elle dépasse 3 mois dans le passé
    }
    setCurrentDate(newDate);
  };

  const handleEventSelect = (event) => {
    const now = new Date();
    const eventStart = new Date(event.start);
    const startHour = eventStart.getHours();
    let color;

    if (eventStart < now) {
      color = "#e6e6e6"; // Couleurs pour les événements passés
    } else {
      color = startHour < 12 ? "#f0ad4e" : "#5cb85c"; // Couleurs pour matin ou après-midi
    }

    setSelectedEvent({ ...event, color });
    // console.log("Selected Reservation: ", event);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);
  const onModify = () => {
    // Exemple de navigation vers un formulaire de modification pour l'événement sélectionné
    // navigate(`/modifyReservation/${selectedEvent.reservationId}`);
    console.log("Je suis dans ONModify", selectedEvent.source);
  };

  return (
    <>
      <div style={{ height: "600px", width: "850" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          min={minTime}
          max={maxTime}
          eventPropGetter={eventPropGetter}
          defaultView="week"
          date={currentDate}
          onNavigate={onNavigate}
          onSelectEvent={handleEventSelect}
          components={{
            agenda: {
              event: AgendaEvent,
            },
          }}
        />
      </div>

      {showModal && selectedEvent && (
        <ReservationDetails
          show={showModal}
          onHide={closeModal}
          event={selectedEvent}
          onModify={() => onModify(selectedEvent)}
          onDelete={() => setShowConfirmationModal(true)} // Mise à jour pour afficher le modal de confirmation
          showConfirmationModal={showConfirmationModal}
          setShowConfirmationModal={setShowConfirmationModal}
        />
      )}
    </>
  );
}

export default MyCalendar;
