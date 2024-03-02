import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function MyCalendar({ events }) {
  const [currentDate, setCurrentDate] = useState(new Date());
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
      newStyle.backgroundColor = "#f3d3a4"; // Couleur pour les événements passés, par exemple rouge
    } else if (eventStart < now && startHour > 12) {
      newStyle.backgroundColor = "#8ab48a";
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

  return (
    <div style={{ height: "600px" }}>
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
      />
    </div>
  );
}

export default MyCalendar;
