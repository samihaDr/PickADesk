import React, { useEffect, useState } from "react";
import axios from "axios";
import MyCalendar from "./MyCalendar";

function Reservations() {
  const [events, setEvents] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // Ajouté pour le rafraîchissement
  useEffect(() => {
    fetchAllReservations().then(setEvents).catch(console.error);
  }, [refreshKey]);

  async function fetchAllReservations() {
    const urls = [
      "/api/reservations/pastReservationsLastThreeMonths",
      "/api/reservations/myReservations?filter=week",
      "/api/reservations/nextMonthReservations",
    ];

    try {
      const responses = await Promise.all(urls.map((url) => axios.get(url)));
      const allReservations = responses.flatMap(
        (response) => response.data || [],
      );
      const allEvents = convertReservationsToEvents(allReservations);
      return deduplicateEvents(allEvents);
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations", error);
      throw error; // Rethrow l'erreur pour le catch dans useEffect
    }
  }

  function convertReservationsToEvents(reservations) {
    return reservations.flatMap((reservation) => {
      const { start, end } = calculateEventTimes(reservation);
      return {
        title: `Post n° : ${reservation.workStation.workPlace}`,
        ...reservation,
        start,
        end,
        allDay: false,
        resource: reservation.id,
      };
    });
  }

  function calculateEventTimes(reservation) {
    const date = new Date(reservation.reservationDate);
    let start = new Date(date);
    let end = new Date(date);
    if (reservation.morning && reservation.afternoon) {
      start.setHours(8, 0, 0); // Début de journée
      end.setHours(18, 0, 0); // Fin de journée
    } else if (reservation.morning) {
      start.setHours(8, 0, 0);
      end.setHours(12, 0, 0);
    } else if (reservation.afternoon) {
      start.setHours(13, 0, 0);
      end.setHours(17, 0, 0);
    }
    return { start, end };
  }

  function deduplicateEvents(events) {
    return events.filter(
      (event, index, self) =>
        index === self.findIndex((e) => e.resource === event.resource),
    );
  }

  return (
    <div className="main">
      <h2>My Reservations</h2>
      <MyCalendar
        events={events}
        refreshEvents={() => setRefreshKey((prevKey) => prevKey + 1)}
      />
    </div>
  );
}

export default Reservations;
