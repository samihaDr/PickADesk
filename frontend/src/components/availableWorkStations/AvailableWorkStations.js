import React, { useContext, useEffect, useState } from "react";
import { WorkStationContext } from "../../services/WorkStationContext";
import { GlobalContext } from "../../services/GlobalState";
import { getBookingPreferencesData } from "../../services/GetBookingPreferencesData";
import "./AvailableWorkStations.scss";
import { useNavigate } from "react-router-dom";
import retour from "../../assets/images/retour.png";

export default function AvailableWorkStations() {
  const navigate = useNavigate();
  const { userConnected } = useContext(GlobalContext);
  const { workStations, selectedOptions } = useContext(WorkStationContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    zones: [],
    reservationTypes: [],
    workAreas: [],
    screens: [],
    equipment: [],
    furniture: [],
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const bookingPreferencesData = await getBookingPreferencesData();
        setData(bookingPreferencesData);
      } catch (error) {
        console.error("Error fetching booking preferences:", error);
        // Gérer l'erreur comme afficher un message à l'utilisateur
      }
      setLoading(false);
    }

    fetchData();
  }, []);
  useEffect(() => {
    console.log("WorkStations in AvailableWorkStations: ", workStations);
    console.log("SelectedOptions in AVAilableWorkStations : ", selectedOptions);
  }, [selectedOptions, workStations]);

  if (!workStations || !selectedOptions) {
    return <p>Chargement des données...</p>; // Ou tout autre message/gestion d'erreur
  }

  // Accéder au tableau 'content' pour la liste des postes de travail
  const workStationList = workStations.content || [];
  if (!userConnected) {
    return null;
  }

  const handleBackClick = () => {
    navigate("/searchWorkStation"); // Assurez-vous que le chemin est correct
  };
  // Fonction pour obtenir le nom correspondant à un ID donné dans une catégorie spécifique
  const getNameById = (category, id) => {
    const foundItem = data[category].find((item) => item.id === id);
    return foundItem ? foundItem.name : "any";
  };

  const formattedDate = new Date(selectedOptions.date).toLocaleDateString(
    "fr-FR",
  );
  const getTimePeriod = () => {
    const { morning, afternoon } = selectedOptions.timePeriod;

    if (morning && afternoon) {
      return "morning and afternoon";
    }
    if (morning) {
      return "morning";
    }
    if (afternoon) {
      return "afternoon";
    }
    return "any"; // ou toute autre valeur par défaut
  };
  const timePeriodString = getTimePeriod();
  function handleReservationClick(stationId) {
    console.log("Réservation demandée pour le poste de travail ID:", stationId);
    // Ici, vous pouvez ajouter la logique pour gérer la réservation
  }
  return (
    <div>
      <div className="search-resume">
        <div className="selected-options-container">
          <p>
            You are looking for a workspace in the{" "}
            <span className="bold-text">
              {getNameById("zones", selectedOptions.zone) || "any"}
            </span>{" "}
            ,
            <span className="bold-text">
              {getNameById("workAreas", selectedOptions.workArea) || "any"}
            </span>{" "}
            area, of type{" "}
            <span className="bold-text">
              {getNameById(
                "reservationTypes",
                selectedOptions.reservationType,
              ) || "any"}{" "}
            </span>
            for this date: <span className="bold-text">{formattedDate}</span>,
            in <span className="bold-text"> {timePeriodString}</span>.
          </p>
          <button onClick={handleBackClick} className="back-button">
            <img
              src={retour}
              alt="retour"
              width="30"
              height="30"
              // className="d-inline-block align-text-top"
            />
          </button>
        </div>
      </div>
      <div className="search-result">
        <h2 style={{ color: "#1f4e5f" }}>Pick a desk</h2>
        <h4>Available workStations :</h4>
        {workStations.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">WorkPlace</th>
                <th scope="col">Zone</th>
                <th scope="col">ReservationType</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              {workStationList.map((station) => (
                <tr key={station.id}>
                  <td>{station.id}</td>
                  <td>{station.workPlace}</td>
                  <td>{station.zone}</td>
                  <td>{station.reservationType}</td>
                  <td>
                    <button onClick={() => handleReservationClick(station.id)}>
                      Réserver
                    </button>
                  </td>{" "}
                  {/* Bouton de réservation pour chaque ligne */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No workstations available.</p>
        )}
      </div>
    </div>
  );
}
