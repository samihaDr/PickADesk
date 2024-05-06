import React, {useContext, useEffect, useState} from "react";
import {WorkStationContext} from "../../services/WorkStationContext";
import {GlobalContext} from "../../services/GlobalState";
import {getBookingPreferencesData} from "../../services/GetBookingPreferencesData";
import "./AvailableWorkStations.scss";
import { Link } from "react-router-dom";
import {Button, Modal} from "react-bootstrap";
import axios from "axios";
import {bookWorkStation} from "../../services/BookWorkStation";
import {format} from "date-fns";
import {AUTH_TOKEN_KEY} from "../../App";
import useCalculateRemaining from "../hooks/useCalculateRemaining";

export default function AvailableWorkStations({formSent}) {
    const {userInfo = {}} = useContext(GlobalContext);
    const {
        workStations,
        selectedOptions,
        isGroupBooking,
        teamMembers,
        selectedStations,
        setSelectedStations
    } =
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
    const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);
    const [favorites, setFavorites] = useState([]);
    const calculateRemaining = useCalculateRemaining();


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
        const loadedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(loadedFavorites);
    }, []);

    useEffect(() => {
        if (selectedStations.length > 0) {
            console.log("Selected stations updated: ", selectedStations);
            console.log("Team member IDs in AvailableWork....: ", teamMembers);
        }
    }, [selectedStations, teamMembers]);

    // Ajout d'une fonction pour vérifier si un poste est favori
    const isFavorite = (stationId) => {
        return favorites.some((fav) => fav.id === stationId);
    };

    if (!workStations || !selectedOptions) {
        return <p>Loading data...</p>;
    }

    // Accéder au tableau 'content' pour la liste des postes de travail
    const workStationList = workStations.content || [];

    if (!userInfo) {
        return null;
    }

    // Fonction pour obtenir le nom correspondant à un ID donné dans une catégorie spécifique
    const getNameById = (category, id) => {
        const foundItem = data[category].find((item) => item.id === id);
        return foundItem ? foundItem.name : "any";
    };

    const formattedDate = new Date(selectedOptions.date).toLocaleDateString(
        "fr-FR",
    );
    const getTimePeriod = () => {
        if (!selectedOptions.timePeriod) {
            return "any";
        }

        const {morning, afternoon} = selectedOptions.timePeriod;
        if (morning && afternoon) {
            return "morning and afternoon";
        } else if (morning) {
            return "morning";
        } else if (afternoon) {
            return "afternoon";
        }
        return "any";
    };

    const timePeriodString = getTimePeriod();

    const checkIfReservationCanBeMade = async (stationId, selectedOptions) => {
        const {morning, afternoon} = selectedOptions.timePeriod;
        const formattedDate = format(new Date(selectedOptions.date), "yyyy-MM-dd");
        console.log("ReservationDate : ", formattedDate);
        try {
            const response = await axios.get(
                `/api/reservations/checkReservation/${userInfo.id}/${formattedDate}?morning=${morning}&afternoon=${afternoon}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                },
            );
            // Le backend retourne directement true ou false
            console.log("ReseponseCheck : ", response.data);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la vérification de la réservation:", error);
            return false; // Retourner false en cas d'erreur de la requête
        }
    };

    const handleGroupReservationSubmit = async () => {
        if (selectedStations.length !== teamMembers.length) {
            alert(`Please select exactly ${teamMembers.length} workstations for your group.`);
            return;
        }

        setLoading(true);

        const reservationDetails = selectedStations.map((stationId, index) => ({
            workStation: { id: stationId },
            reservationDate: format(new Date(selectedOptions.date), "yyyy-MM-dd"),
            morning: selectedOptions.timePeriod.morning,
            afternoon: selectedOptions.timePeriod.afternoon,
            reservationTypeId: selectedOptions.reservationType,
            userId: teamMembers[index]
        }));

        console.log("Sending group reservation details XXXXLLL: ", reservationDetails);

        try {
            const result = await bookWorkStation(reservationDetails, true);
            if (result.success) {
                setShowModal(true);
                await calculateRemaining(userInfo.id);
                console.log("Group reservation successful.");
            } else {
                alert("Some reservations failed. Please check the details and try again.");
                console.log("Group booking result: ", result);
            }
        } catch (error) {
            console.error("Error during group reservation process:", error);
            alert("An error occurred during the group booking process.");
        }

        setLoading(false);
    };


    const handleReservationClick = async (stationId) => {
        setLoading(true); // Activer l'indicateur de chargement

        try {
            const canBook = await checkIfReservationCanBeMade(
                stationId,
                selectedOptions,
            );
            console.log("Can book:", canBook);
            if (!canBook) {
                // Création de l'objet de réservation pour un individu
                const reservationDetails = {
                    workStation: { id: stationId },
                    reservationDate: format(new Date(selectedOptions.date), "yyyy-MM-dd"),
                    morning: selectedOptions.timePeriod.morning,
                    afternoon: selectedOptions.timePeriod.afternoon,
                    reservationTypeId: selectedOptions.reservationType,
                };

                const reservationResult = await bookWorkStation(reservationDetails, false);
                console.log("Reservation result:", reservationResult);
                if (reservationResult.success) {
                    await calculateRemaining(userInfo.id);
                    console.log("Remaining recalculated for user:", userInfo.id);

                    const details = await fetchWorkStationDetails(stationId);
                    if (details) {
                        setSelectedStationDetails(details);
                        setShowModal(true);
                    } else {
                        alert("Failed to fetch details.");
                    }
                } else {
                    alert(reservationResult.message); // Utiliser le message d'erreur du service
                }
            } else {
                alert("A reservation already exists for the selected period.");
            }
        } catch (error) {
            console.error("Error in reservation click process:", error);
            alert("An error occurred during the booking process.");
        }

        setLoading(false); // Désactiver l'indicateur de chargement
    };
    const fetchWorkStationDetails = async (stationId) => {
        try {
            const response = await axios.get(`/api/workStations/${stationId}`);
            console.log("Workstation details fetched:", response.data);
            return response.data; // Return the data so it can be set in state
        } catch (error) {
            console.error("Error fetching workstation details:", error);
            return null; // Return null if there was an error
        }
    };


    const toggleStationSelection = (stationId) => {
        setSelectedStations(prev => {
            if (prev.includes(stationId)) {
                return prev.filter(id => id !== stationId); // Désélectionner
            } else {
                return [...prev, stationId]; // Sélectionner
            }
        });
    };
    // const handleNextPage = () => {
    //   if (currentPage < totalPages - 1) {
    //     setCurrentPage(currentPage + 1);
    //   }
    // };
    //
    // const handlePreviousPage = () => {
    //   if (currentPage > 0) {
    //     setCurrentPage(currentPage - 1);
    //   }
    // };
    function addToCalendar() {
        console.log("Add to calendar earlier !!");
        window.location.reload();
    }

    function closeModal() {
        setShowModal(false);
        window.location.reload();
        // navigate('/makeAReservation');
    }

    if (!formSent) {
        return (
            <div className="loading-container">
                <i
                    className="bi bi-hourglass-split"
                    style={{fontSize: "55px", color: "gray"}}
                ></i>
                <p>Waiting for search...</p>
            </div>
        );
    }
    return (
        <>
            <div className="main">
                <h2>Pick a desk</h2>

                <div className="search-resume">
                    <div className="selected-options-container">
                        {isGroupBooking ? (
                            <div>
                                You are about to make a group reservation. You need to
                                book <span className="bold-text">{teamMembers.length} </span> stations.

                                For this date: <span className="bold-text">{formattedDate}</span>,
                                in <span className="bold-text"> {timePeriodString}</span>.{""}
                                <br/>
                                You have <span className="bold-text">{selectedStations.length}</span> station reserved
                                for the moment.

                            </div>
                        ) : (
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
                        )}
                    </div>
                </div>
                <div className="center-container">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="#">
                                List
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/officeMap">
                                Select on plan
                            </Link>
                        </li>
                    </ul>
                </div>
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
                                    <td>
                                        {" "}
                                        {station.workPlace}
                                        {isFavorite(station.id) ? (
                                            <span style={{color: "green", fontSize: "24px"}}>
                          ★
                        </span>
                                        ) : null}
                                    </td>
                                    <td>{station.zone.name}</td>
                                    <td>{station.workArea.name}</td>
                                    <td>
                                        {isGroupBooking ? (
                                            <input
                                                type="checkbox"
                                                checked={selectedStations.includes(station.id)}
                                                onChange={() => toggleStationSelection(station.id)}
                                            />
                                        ) : (
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleReservationClick(station.id)}
                                            >
                                                Pick this one
                                            </button>
                                        )}
                                    </td>
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
                    {/*<div>*/}
                    {/*  <button onClick={onPreviousPage} disabled={currentPage === 0}>Previous</button>*/}
                    {/*  <span> Page {currentPage + 1} of {totalPages} </span>*/}
                    {/*  <button onClick={onNextPage} disabled={currentPage >= totalPages - 1}>Next</button>*/}
                    {/*</div>*/}
                </div>
                {isGroupBooking && (
                    <button
                        className="btn btn-primary"
                        onClick={handleGroupReservationSubmit}
                        disabled={selectedStations.length !== teamMembers.length}
                    >
                        Confirm Group Reservation
                    </button>
                )}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Reservation Confirmed</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedStationDetails ? (
                        <div>
                            <div className="centered-icon">
                                <i
                                    className="bi bi-check-circle-fill"
                                    style={{color: "green", fontSize: "4,5rem"}}
                                ></i>
                            </div>
                            <div>
                                <p>
                                    <i className="bi bi-calendar3"></i> Date: {formattedDate}
                                </p>
                                <p>
                                    <i className="bi bi-building"></i> WorkPlace:{" "}
                                    {selectedStationDetails.workPlace}
                                </p>
                                <p>
                                    <i className="bi bi-geo-alt"></i> Zone:{" "}
                                    {selectedStationDetails.zone.name}
                                </p>
                                <p>
                                    <i className="bi bi-layout-text-sidebar-reverse"></i> AreaWork
                                    Type: {selectedStationDetails.workArea.name}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p>Failed to load reservation details.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <div className="w-100 d-flex justify-content-between">
                        <Button
                            variant="primary"
                            className="flex-grow-1 me-5"
                            onClick={addToCalendar}
                        >
                            Add to Calendar
                        </Button>
                        <Button
                            variant="secondary"
                            className="flex-grow-1 me-2"
                            onClick={closeModal}
                        >
                            Close
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}
