import React, {useContext, useEffect, useState} from "react";
import {WorkStationContext} from "../../services/WorkStationContext";
import {GlobalContext} from "../../services/GlobalState";
import {getBookingPreferencesData} from "../../services/GetBookingPreferencesData";
import "./AvailableWorkStations.scss";
import OfficeMap from "../officeMap/OfficeMap.js";
import {Button, Modal} from "react-bootstrap";
import axios from "axios";
import {bookWorkStation} from "../../services/BookWorkStation";
import {format} from "date-fns";
import {AUTH_TOKEN_KEY} from "../../App";
import useCalculateRemaining from "../hooks/useCalculateRemaining";
import notify from "../../services/toastNotifications";

export default function AvailableWorkStations({formSent}) {
    const {userInfo = {}} = useContext(GlobalContext);
    const {
        workStations,
        selectedOptions,
        isGroupBooking,
        isColleagueBooking,
        selectedStations,
        setSelectedStations,
        selectedMembers,
        selectedColleague,
        currentPage,
        setCurrentPage,
        totalPages
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
    const [activeTab, setActiveTab] = useState('result');

    AvailableWorkStations.defaultProps = {
        onPageChange: () => console.log("onPageChange n'est pas passé."),
    };
    useEffect(() => {
        console.log("WorkStations props in :", workStations);
        console.log("Total Pages in AvailableWorkStations : ", totalPages);
        console.log("Current Page in AvailableWorkStations: ", currentPage);
    }, [workStations, totalPages, currentPage]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const bookingPreferencesData = await getBookingPreferencesData();
                setData(bookingPreferencesData);
            } catch (error) {
                console.error("Error fetching booking preferences:", error);
                notify.error("Failed to load booking preferences.");
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
            console.log("Team member IDs in AvailableWork....: ", selectedMembers);
        }
    }, [selectedStations, selectedMembers]);


    // Ajout d'une fonction pour vérifier si un poste est favori
    const isFavorite = (stationId) => {
        return favorites.some((fav) => fav.id === stationId);
    };

    if (!workStations || !selectedOptions) {
        notify.info("Loading data...");
        return <p>Loading data...</p>;
    }

    const workStationList = workStations && workStations ? workStations : [];

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
        const userId = isColleagueBooking ? selectedColleague : userInfo.id;
        try {
            const response = await axios.get(
                `/api/reservations/checkReservation/${userId}/${formattedDate}?morning=${morning}&afternoon=${afternoon}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                },
            );
            // Le backend retourne directement true ou false
            console.log("ResponseCheck : ", response.data);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la vérification de la réservation:", error);
            notify.error("Failed to check reservation availability.");
            return false; // Retourner false en cas d'erreur de la requête
        }
    };

    const handleGroupReservationSubmit = async () => {
        if (selectedStations.length !== selectedMembers.length) {
            notify.error(`Please select exactly ${selectedMembers.length} workstations for your group.`);
            return;
        }

        setLoading(true);

        const reservationDetails = selectedStations.map((stationId, index) => ({
            workStation: {id: stationId},
            reservationDate: format(new Date(selectedOptions.date), "yyyy-MM-dd"),
            morning: selectedOptions.timePeriod.morning,
            afternoon: selectedOptions.timePeriod.afternoon,
            reservationTypeId: selectedOptions.reservationType,
            userId: selectedMembers[index]
        }));

        try {
            const result = await bookWorkStation(reservationDetails, true, false);
            if (result.success) {
                setShowModal(true);
                await calculateRemaining(userInfo.id);
            } else {
                //alert("Some reservations failed. Please check the details and try again.");
                notify.error("Some reservations failed. Please check the details and try again.");
            }
        } catch (error) {
            notify.error("An error occurred during the group booking process.");
        }

        setLoading(false);
    };


    const handleReservationClick = async (stationId) => {
        setLoading(true); // Activer l'indicateur de chargement
        console.log("SelectedColleague : ", selectedColleague);
        console.log("IsColleagueBooking : ", isColleagueBooking);
        try {
            const canBook = await checkIfReservationCanBeMade(
                stationId,
                selectedOptions,
            );
            console.log("Can book:", canBook);
            if (!canBook) {
                // Création de l'objet de réservation pour un individu ou un collègue
                const reservationDetails = {
                    workStation: {id: stationId},
                    reservationDate: format(new Date(selectedOptions.date), "yyyy-MM-dd"),
                    morning: selectedOptions.timePeriod.morning,
                    afternoon: selectedOptions.timePeriod.afternoon,
                    reservationTypeId: selectedOptions.reservationType,
                    colleagueId: selectedColleague,
                    isColleagueBooking: isColleagueBooking
                };
                console.log("Sending reservation details IndividualReservation: ", reservationDetails);
                console.log("isColleagueBooking after bookWorkStation ", isColleagueBooking);
                const reservationResult = isColleagueBooking ? await bookWorkStation(reservationDetails, false, true) :
                    await bookWorkStation(reservationDetails, false, false);
                console.log("SelectedColleague after bookWorkStation ", reservationDetails.colleagueId);

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
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            handlePageChange(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            handlePageChange(currentPage - 1);
        }
    };

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
                                book <span className="bold-text">{selectedMembers.length} </span> stations.

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

                <div className="tabs">
                    <button className={activeTab === 'result' ? 'active' : ''}
                            onClick={() => setActiveTab('result')}>Results
                    </button>
                    <button className={activeTab === 'map' ? 'active' : ''} onClick={() => setActiveTab('map')}>Map
                    </button>
                </div>
                {activeTab === 'result' ? (
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
                        <div>
                            <button className="btn-info" onClick={handlePreviousPage}
                                    disabled={currentPage === 0}>Previous
                            </button>
                            <span> Page {currentPage + 1} of {totalPages} </span>
                            <button className="btn-info" onClick={handleNextPage}
                                    disabled={currentPage >= totalPages - 1}>Next
                            </button>
                        </div>
                        {/*{Array.from({ length: totalPages }, (_, index) => (*/}
                        {/*    <button key={index} onClick={() => handlePageChange(index)}>*/}
                        {/*        {index + 1}*/}
                        {/*    </button>*/}
                        {/*))}*/}

                    </div>
                ) : (

                    <OfficeMap/>
                )}
                {isGroupBooking && (
                    <button
                        className="btn btn-primary"
                        onClick={handleGroupReservationSubmit}
                        disabled={selectedStations.length !== selectedMembers.length}
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
                    {isGroupBooking ? (
                        <div>
                            <div className="centered-icon">
                                <i className="bi bi-check-circle-fill" style={{color: "green", fontSize: "4.5rem"}}></i>
                            </div>
                            <h4 className="text-success">Reservation Successful!</h4>
                            <p>You have successfully completed a group reservation for your team.</p>
                            <p>
                                <strong>Total Stations
                                    Reserved:</strong> {selectedStations.length} for <strong>{selectedMembers.length}</strong> team
                                members.
                            </p>
                            <p>
                                <strong>Date:</strong> {formattedDate}
                            </p>
                            <p>
                                <strong>Time Period:</strong> {timePeriodString}
                            </p>
                            <p>Please check your email for confirmation details and further instructions.</p>
                        </div>
                    ) : (
                        <div>
                            <div className="centered-icon">
                                <i className="bi bi-check-circle-fill" style={{color: "green", fontSize: "4.5rem"}}></i>
                            </div>
                            <h4 className="text-success">Reservation Successful!</h4>
                            <p>Your reservation has been successfully completed.</p>
                            <p>
                                <strong>WorkPlace:</strong> {selectedStationDetails ? selectedStationDetails.workPlace : "N/A"}
                            </p>
                            <p>
                                <strong>Zone:</strong> {selectedStationDetails ? selectedStationDetails.zone.name : "N/A"}
                            </p>
                            <p>
                                <strong>AreaWork
                                    Type:</strong> {selectedStationDetails ? selectedStationDetails.workArea.name : "N/A"}
                            </p>
                            <p>
                                <strong>Date:</strong> {formattedDate}
                            </p>
                            <p>
                                <strong>Time Period:</strong> {timePeriodString}
                            </p>
                            <p>Please check your email for confirmation details.</p>
                        </div>
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