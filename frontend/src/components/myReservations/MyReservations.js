import React, { useEffect, useState } from "react";
import axios from "axios";
import MyCalendar from "./MyCalendar";

function Reservations() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchAllReservations = async () => {
      try {
        const pastResResponse = await axios.get(
          "/api/reservations/pastReservationsLastThreeMonths",
        );
        const currentResResponse = await axios.get(
          "/api/reservations/myReservations?filter=week",
        );
        const futureResResponse = await axios.get(
          "/api/reservations/nextMonthReservations",
        );
        const pastReservations = pastResResponse.data || [];
        const currentReservations = currentResResponse.data || [];
        const futureReservations = futureResResponse.data || [];
        const allReservations = [
          ...pastReservations,
          ...currentReservations,
          ...futureReservations,
        ];
        console.log(
          "AllReservations in Reservations Current : ",
          allReservations,
        );
        // Convertir toutes les réservations en événements de calendrier
        const allEvents = convertReservationsToEvents(allReservations);

        // Filtrer les doublons en se basant sur l'id de la réservation
        const uniqueEvents = allEvents.filter(
          (event, index, self) =>
            index === self.findIndex((e) => e.resource === event.resource),
        );

        setEvents(uniqueEvents);
        console.log("Events in Reservations Current : ", events);
      } catch (error) {
        console.error("Erreur lors de la récupération des réservations", error);
      }
    };

    fetchAllReservations();
  }, []);

  const convertReservationsToEvents = (reservations) => {
    return reservations.flatMap((reservation) => {
      const date = new Date(reservation.reservationDate);
      let events = [];

      if (reservation.morning) {
        events.push({
          title: `On site - morning`,
          start: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            8,
            0,
          ),
          end: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            12,
            0,
          ),
          allDay: false,
          resource: reservation.id,
        });
      }

      if (reservation.afternoon) {
        events.push({
          title: `On site - afternoon`,
          start: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            13,
            0,
          ),
          end: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            17,
            0,
          ),
          allDay: false,
          resource: reservation.id,
        });
      }

      return events;
    });
  };

  return (
    <div className="main">
      <h2>My Reservations</h2>
      <MyCalendar events={events} />
    </div>
  );
}

export default Reservations;
