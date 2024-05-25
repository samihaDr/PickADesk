import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ReservationDetails from "../reservation/ReservationDetails";

const localizer = momentLocalizer(moment);



const getEventStyle = (event) => {
  const eventStart = moment(event.start);
  const eventEnd = moment(event.end);
  const now = moment();
  let backgroundColor = "#3174ad";

  if (eventStart.hours() < 12 && eventEnd.hours() > 12) {
    backgroundColor = "#44d095";
  } else if (eventStart.hours() < 12) {
    backgroundColor = "#ADD8E6";
  } else {
    backgroundColor = "#FFEF4F";
  }

  if (
    eventStart.isBefore(now, "day") ||
    (eventStart.isSame(now, "day") && now.hours() >= 18)
  ) {
    backgroundColor = "#e6e6e6"; // Couleur pour les événements passés
  }

  return {
    backgroundColor,
    color: "#1f4e5f",
    borderRadius: "10px",
    border: "none",
  };
};
function MyEvent({ event }) {
  return (
      <div>
        <img src={event.icon} alt={event.alt} style={{ height: 30, width: 30 }} />
        <br/>
        <br/>
        <span>Seat n°: {event.workStation.workPlace}</span>
      </div>
  );
}
function MyCalendar({ events, refreshEvents }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const threeMonthsAgo = moment().subtract(3, "months");
  const minTime = new Date().setHours(7, 0, 0);
  const maxTime = new Date().setHours(19, 0, 0);

  const eventPropGetter = (event) => ({
    style: getEventStyle(event),
  });

  const onNavigate = (newDate, view, action) => {
    if (action === "PREV" && moment(newDate).isBefore(threeMonthsAgo, "day")) {
      return;
    }
    setCurrentDate(newDate);
  };

  const handleEventSelect = (event) => {
    setSelectedEvent({ ...event, color: getEventStyle(event).backgroundColor });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <>
      <div style={{ height: "600px", width: "1000px" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          min={new Date(minTime)}
          max={new Date(maxTime)}
          eventPropGetter={eventPropGetter}
          defaultView="week"
          date={currentDate}
          onNavigate={onNavigate}
          onSelectEvent={handleEventSelect}
          components={{
            agenda: {
              event: MyEvent,
            },
            event: MyEvent
          }}
        />
      </div>

      {showModal && selectedEvent && (
        <ReservationDetails
          show={showModal}
          onHide={closeModal}
          event={selectedEvent}
          refreshEvents={refreshEvents}
          onDelete={() => setShowConfirmationModal(true)} // Mise à jour pour afficher le modal de confirmation
          showConfirmationModal={showConfirmationModal}
          setShowConfirmationModal={setShowConfirmationModal}
        />
      )}
    </>
  );
}

export default MyCalendar;
