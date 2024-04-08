import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SelectFavorite({ date, timePeriod }) {
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState(""); // State to store the user message

  useEffect(() => {
    const loadedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(loadedFavorites);
  }, []);

  useEffect(() => {
    // This effect logs the date and timePeriod whenever they change
    console.log("Date updated:", date);
    console.log("Time Period updated:", timePeriod);
    console.log("Messaaaaaaage : ", message);
  }, [date, timePeriod, message]);

  const checkAvailability = async (
    workStationId,
    reservationDate,
    morning,
    afternoon,
  ) => {
    const token = localStorage.getItem("token"); // Ensure you handle the token securely
    try {
      const response = await axios.get(
        `/api/reservations/checkSelectFavoriteIsAvailable/${workStationId}/${reservationDate}`,
        {
          params: { morning, afternoon },
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data; // Assuming response.data is true if available, false otherwise
    } catch (error) {
      console.error("Failed to check availability:", error);
      setMessage("Failed to check availability: " + error.message); // Set error message
      return null; // Return null on error
    }
  };

  const selectFavorite = async (favorite) => {
    console.log("Selecting Favorite ID:", favorite.id);
    const formattedDate = date.toISOString().split("T")[0];
    const unavailable = await checkAvailability(
      favorite.id,
      formattedDate,
      timePeriod.morning,
      timePeriod.afternoon,
    );
    if (unavailable === null) {
      setMessage("Problem");
      console.log("Message set to : Problem", message);
    } else if (unavailable) {
      setMessage("The workstation is available!");
      console.log("Message set to :The workstation is available!", message);
    } else {
      setMessage("This workstation is not available at the selected times.");
      console.log(
        "Message set to : This workstation is not available at the selected times",
        message,
      );
    }
  };

  return (
    <div className="selectFavorite">
      {message && <div className="alert alert-info">{message}</div>}
      {favorites.length > 0 ? (
        <ul className="list-group">
          {favorites.map((favorite, index) => (
            <li key={index} className="list-group-item">
              <button
                className="btn btn-link"
                onClick={() => selectFavorite(favorite)}
              >
                {favorite.workPlace}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No favorites added.</p>
      )}
    </div>
  );
}
