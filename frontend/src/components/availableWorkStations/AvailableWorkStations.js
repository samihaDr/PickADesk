import React, { useContext, useEffect, useState } from "react";
import { WorkStationContext } from "../../services/WorkStationContext";
import { GlobalContext } from "../../services/GlobalState";
import { getBookingPreferencesData } from "../../services/GetBookingPreferencesData";
import "./AvailableWorkStations.scss";
import { useNavigate } from "react-router-dom";
import back from "../../assets/images/back.png";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { bookWorkStation } from "../../services/BookWorkStation";

export default function AvailableWorkStations() {
  const navigate = useNavigate();
  const { userInfo } = useContext(GlobalContext);
  const { workStations, selectedOptions, setWorkStations } =
    useContext(WorkStationContext);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState({
    zones: [],
    reservationTypes: [],
    workAreas: [],
    screens: [],
    equipment: [],
    furniture: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedStationDetails, setSelectedStationDetails] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const bookingPreferencesData = await getBookingPreferencesData();
        setData(bookingPreferencesData);
      } catch (error) {
        console.error("Error fetching booking preferences:", error);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  // useEffect(() => {
  //   console.log("WorkStations in AvailableWorkStations: ", workStations);
  //   console.log("SelectedOptions in AVAilableWorkStations : ", selectedOptions);
  // }, [selectedOptions, workStations]);

  if (!workStations || !selectedOptions) {
    return <p>Loading data...</p>;
  }

  // Accéder au tableau 'content' pour la liste des postes de travail
  const workStationList = workStations.content || [];

  if (!userInfo) {
    return null;
  }

  const handleBackClick = () => {
    navigate("/searchWorkStation");
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
  const handleReservationClick = (stationId) => {
    fetchWorkStationDetails(stationId);
    console.log("SelectedReservation : ", stationId);
  };
  const fetchWorkStationDetails = async (stationId) => {
    try {
      const response = await axios.get(`/api/workStations/${stationId}`);
      setSelectedStationDetails(response.data);
      console.log("SelectedStationDetails : ", response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching workstation details:", error);
    }
  };

  const handleConfirmReservation = async () => {
    if (!selectedStationDetails) return;
    try {
      // Appel à bookWorkStation avec les détails nécessaires
      await bookWorkStation(selectedStationDetails.id, selectedOptions);
      console.log("Reservation added successfully");

      // Mettre à jour la liste des postes de travail disponibles
      setWorkStations({
        ...workStations,
        content: workStations.content.filter(
          (station) => station.id !== selectedStationDetails.id,
        ),
      });

      setShowModal(false); // Fermer la modal après la confirmation
      navigate("/myReservations");
    } catch (error) {
      console.error("Failed to confirm reservation:", error);
      // alert("Failed to confirm reservation. Please try again."); // Informer l'utilisateur en cas d'échec
    }
  };

  return (
    <>
      <div className="main">
        <div className="search-resume">
          <div className="selected-options-container">
            <div>
              You are looking for a workspace in the{" "}
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
            </div>
            <button onClick={handleBackClick} className="back-button">
              <img
                src={back}
                alt="back"
                width="30"
                height="30"
                // className="d-inline-block align-text-top"
              />
            </button>
          </div>
        </div>
        <h2 style={{ color: "#1f4e5f" }}>Pick a desk</h2>
        <div className="search-result">
          {workStationList.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">WorkPlace</th>
                  <th scope="col">Zone</th>
                  <th scope="col">AreaWork Type</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {workStationList.map((station) => (
                  <tr key={station.id}>
                    <td>{station.workPlace}</td>
                    <td>{station.zone.name}</td>
                    <td>{station.workArea.name}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleReservationClick(station.id)}
                      >
                        Pick this one
                      </button>
                    </td>{" "}
                    {/* Bouton de réservation pour chaque ligne */}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>
              <strong>No workstations available. </strong>
            </div>
          )}
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reservation Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStationDetails && (
            <div>
              <p>WorkPlace: {selectedStationDetails.workPlace}</p>
              <p>Zone: {selectedStationDetails.zone.name}</p>
              <p>AreaWork Type: {selectedStationDetails.workArea.name}</p>
              <p>Date: {formattedDate}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="w-100 d-flex justify-content-between">
            <Button
              variant="primary"
              className="flex-grow-1 me-5"
              onClick={handleConfirmReservation}
            >
              Confirm Reservation
            </Button>
            <Button
              variant="secondary"
              className="flex-grow-1 me-2"
              onClick={() => setShowModal(false)}
            >
              Close
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
