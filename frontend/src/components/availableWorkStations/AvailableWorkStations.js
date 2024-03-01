import React, { useContext, useEffect, useState } from "react";
import { WorkStationContext } from "../../services/WorkStationContext";
import { GlobalContext } from "../../services/GlobalState";
import { getBookingPreferencesData } from "../../services/GetBookingPreferencesData";
import "./AvailableWorkStations.scss";
import { useNavigate } from "react-router-dom";
import back from "../../assets/images/back.png";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";

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

  useEffect(() => {
    console.log("WorkStations in AvailableWorkStations: ", workStations);
    console.log("SelectedOptions in AVAilableWorkStations : ", selectedOptions);
  }, [selectedOptions, workStations]);

  if (!workStations || !selectedOptions) {
    return <p>Loading data...</p>;
  }

  // Accéder au tableau 'content' pour la liste des postes de travail
  const workStationList = workStations.content || [];
  console.log("WorkStationsList in AVAi: ", workStationList);
  console.log("WorkStations in AVAIl: ", workStations);

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

  const handleConfirmReservation = () => {
    console.log(
      "Confirmed reservation for station ID:",
      selectedStationDetails.id,
    );
    setShowModal(false);
    // Suppression de la réservation de la liste
    setWorkStations({
      ...workStations,
      content: workStations.content.filter(
        (s) => s.id !== selectedStationDetails.id,
      ),
    });
    navigate("/currentReservation");
  };

  return (
    <>
      <div className="main">
        <div className="search-resume">
          <div className="selected-options-container">
            <div>
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
          <h4>Available workStations :</h4>
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
            <p>No workstations available.</p>
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirmReservation}>
            Confirm Reservation
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
