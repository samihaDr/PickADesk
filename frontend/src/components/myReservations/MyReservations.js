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
      let start = new Date(date);
      let end = new Date(date);
      // let events = [];

      if (reservation.morning) {
        start.setHours(8, 0, 0);
      } else {
        // Si pas le matin, supposer que la réservation commence l'après-midi
        start.setHours(13, 0, 0);
      }

      if (reservation.afternoon) {
        end.setHours(17, 0, 0);
      } else {
        // Si pas l'après-midi, supposer que la réservation termine le matin
        end.setHours(12, 0, 0);
      }

      return {
        title: reservation.title,
        workPlace: reservation.workStation.workPlace,
        start: start,
        end: end,
        allDay: false,
        resource: reservation.id,
      };
      // return events;
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
