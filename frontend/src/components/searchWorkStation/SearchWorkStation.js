import React, {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../../services/GlobalState";
import {getBookingPreferencesData} from "../../services/GetBookingPreferencesData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./SearchWorkStation.scss";
import {WorkStationContext} from "../../services/WorkStationContext";
import {useTeamList} from "../hooks/useTeamList";
import {AUTH_TOKEN_KEY} from "../../App";

export default function SearchWorkStation({onFormSend}) {
    const [data, setData] = useState({
        reservationTypes: [],
        workAreas: [],
        screens: [],
        equipment: [],
        furniture: [],
    });

    const {workStations, setWorkStations, setSelectedOptions,
        isGroupBooking, setIsGroupBooking,
        teamMembers, setTeamMembers,
        selectedStations, setSelectedStations,
        selectedMembers, setSelectedMembers
        } = useContext(WorkStationContext);
    // const [selectedMembers, setSelectedMembers] = useState([]); // État pour stocker les membres de l'équipe sélectionnés
    const [isLoading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const { userInfo= {}, userPreferences} = useContext(GlobalContext);
    const [isAnyEquipmentChecked, setIsAnyEquipmentChecked] = useState(false);
    const [isAnyFurnitureChecked, setIsAnyFurnitureChecked] = useState(false);
    const { teamList,fetchTeamList, isLoading: isTeamListLoading, error: teamListError } = useTeamList();
    const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);
    const [date, setDate] = useState(new Date());
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour aujourd'hui à minuit
    let minDate = new Date(today);
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(today.getMonth() + 1);

    if (new Date().getHours() >= 13) {
        minDate.setDate(today.getDate() + 1);
    }
    minDate.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour minDate à minuit

    const combinedDateFilter = (date) => {
        const day = date.getDay();
        const isWeekend = day === 0 || day === 6; // 0 pour dimanche, 6 pour samedi
        return !isWeekend && date >= minDate;
    };

    const [timePeriod, setTimePeriod] = useState({
        morning: false,
        afternoon: false,
    });

    const [zone, setZone] = useState("");
    const [reservationType, setReservationType] = useState("");
    const [workArea, setWorkArea] = useState("");
    const [screen, setScreen] = useState("");
    const [equipment, setEquipment] = useState([]);
    const [furniture, setFurniture] = useState([]);
    // const [currentPage, setCurrentPage] = useState(0);
    // const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const bookingPreferencesData = await getBookingPreferencesData();
                setData(bookingPreferencesData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching booking preferences:", error);
                setErrorMessage("Failed to load data.");
                setLoading(false);
            }
        };

        console.log("IsGroupBooking in SearchWorkStation : ", isGroupBooking);
        fetchData();

    }, []);

    useEffect(() => {
        if (isGroupBooking && selectedMembers) {
            console.log("SelectedMembers : " , selectedMembers);
        }
    }, [isGroupBooking, selectedMembers]);

    useEffect(() => {
        resetFormToIndividualPreferences();
    }, [userPreferences, isGroupBooking]);

    const resetFormToIndividualPreferences = () => {
        if (userPreferences && !isGroupBooking) {
            setZone(userPreferences.zone?.id || "");
            setReservationType(userPreferences.reservationType?.id || "");
            setWorkArea(userPreferences.workArea?.id || "");
            setScreen(userPreferences.screen?.id || "");
            setEquipment(userPreferences.equipment.map(e => e.id) || []);
            setFurniture(userPreferences.furniture.map(f => f.id) || []);
        } else if (!userPreferences && !isGroupBooking) {
            // Si aucune préférence utilisateur n'est définie, réinitialiser à des valeurs par défaut
            setZone("");
            setReservationType("");
            setWorkArea("");
            setScreen("");
            setEquipment([]);  // Supposer qu'aucun équipement spécifique n'est requis par défaut
            setFurniture([]);  // Supposer qu'aucun meuble spécifique n'est requis par défaut
        }
    }

    const validateFormData = () => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Réinitialiser l'heure pour aujourd'hui à minuit

        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0); // Réinitialiser l'heure de la date sélectionnée à minuit

        // Vérifier que la date est sélectionnée et valide
        if (!date) {
            return "The date is compulsory.";
        }

        // Vérifier que la date sélectionnée n'est pas aujourd'hui après 13h
        if (
            selectedDate.getTime() === currentDate.getTime() &&
            new Date().getHours() >= 13
        ) {
            return "It is impossible to make a booking after 1pm on the same day.";
        }

        // Vérifier que soit morning, soit afternoon, soit les deux sont cochés
        if (!timePeriod.morning && !timePeriod.afternoon) {
            return "Please select at least one period: Morning or Afternoon.";
        }
        const validationResult = "";
        console.log("Validation result:", validationResult);
        return validationResult;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("handleSubmit called");
        setErrorMessage("");
        const validationError = validateFormData();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }
        setLoading(true);

        const formData = {
            date,
            timePeriod,
            zone,
            reservationType,
            workArea,
            screen,
            equipment,
            furniture,
            isGroupBooking,
            teamMembers,
            selectedStations

        };

        try {
            const response = await sendFormDataToServer(formData);
            console.log("Response from Backend : ", response);
            setWorkStations(response);
            console.log("Available Work Stations : ", workStations);

            setSelectedOptions({
                zone,
                date,
                timePeriod,
                reservationType,
                workArea,
                isGroupBooking,
                teamMembers,
                selectedStations
            });

            onFormSend(); // Déclencher la mise à jour d'état dans le parent
        } catch (error) {
            console.error("Error submitting form", error);
            setErrorMessage("An error occurred while submitting the form.");
        } finally {
            setLoading(false);
        }
    };

    const sendFormDataToServer = async (formData) => {
        const {
            date, // 'yyyy-MM-dd'
            timePeriod, // { morning: true/false, afternoon: true/false }
            zone,
            reservationType,
            workArea,
            screen,
            equipment, // Ce sont des listes d'IDs
            furniture, // Ce sont des listes d'IDs
            isGroupBooking,
            teamMembers,
            selectedStations
        } = formData;
        console.log("FormData :" , formData);
        const params = new URLSearchParams({
            reservationDate: date.toISOString().split("T")[0], // Convertit la date en format ISO (yyyy-MM-dd)
            morning: timePeriod.morning,
            afternoon: timePeriod.afternoon,
            zoneId: zone || "", // Si zone est null ou undefined, cela enverra une chaîne vide
            reservationType: reservationType || "",
            workAreaId: workArea || "",
            screenId: screen || "",
            equipmentIds: equipment.join(",") || "",
            furnitureIds: furniture.join(",") || "",
            isGroupBooking: isGroupBooking ,
            teamMembers: teamMembers || [],
            selectedStations: selectedStations || [],
            page: 0,
            size: 10,
            sortBy: "id",
            order: "asc",
        });

        try {
            const response = await fetch(
                `/api/workStations/search?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (!response.ok) {
                new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
            // setTotalPages(data.totalPages);

        } catch (error) {
            console.error("Error fetching data", error);
            throw error;
        }
    };
    // const handlePageChange = (newPage) => {
    //   setCurrentPage(newPage);
    //   handleSubmit();
    // };
    const handleTimePeriodCheckboxChange = (e) => {
        setTimePeriod({
            ...timePeriod,
            [e.target.name]: e.target.checked,
        });
    };

    const handleAnyEquipmentChange = () => {
        setIsAnyEquipmentChecked(!isAnyEquipmentChecked);
        if (!isAnyEquipmentChecked) {
            setEquipment([]);
        }
    };

    const handleAnyFurnitureChange = () => {
        setIsAnyFurnitureChecked(!isAnyFurnitureChecked);
        if (!isAnyFurnitureChecked) {
            setFurniture([]);
        }
    };

    const handleEquipmentChange = (itemId) => {
        if (isAnyEquipmentChecked) {
            setIsAnyEquipmentChecked(false);
        }
        setEquipment((prev) =>
            prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId],
        );
    };

    const handleFurnitureChange = (itemId) => {
        if (isAnyFurnitureChecked) {
            setIsAnyFurnitureChecked(false);
        }
        setFurniture((prev) =>
            prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId],
        );
    };

    const handleGroupBookingChange = async (e) => {
        const isChecked = e.target.checked;
        setIsGroupBooking(isChecked);
        if (isChecked) {
            try {
                const teamMembersAll = await fetchTeamList(userInfo.teamId, jwt);
                console.log("TeamMembers : ", teamMembersAll);
                const ids = teamMembersAll.map(member => member.id);
                console.log("IDS : " , ids);
                 setTeamMembers(ids);  // Mettre à jour l'état avec les IDs récupérés
                console.log("TeamMemberIds 1 : ", teamMembers);
                // const stationIds = selectedStations.map(station => station.id);
                // console.log("Selected stations in SearchWorkStatiojs: ", stationIds);
                const teamDayId = data.reservationTypes.find(reservationType => reservationType.name === "Team day")?.id || "";
                // const meetingSpaceId = data.workAreas.find(workArea => workArea.name === "Meeting Space")?.id || "";

                setReservationType(teamDayId);
                // setWorkArea(meetingSpaceId);
                setWorkArea("");
                setScreen("");
                setEquipment([]);
                setFurniture([]);
            } catch (error) {
                console.error("Error in group booking change:", error);
            }
        } else {
            // Reset to individual booking defaults or clear the values
            setTeamMembers([]);  // Clear team member IDs when unchecking group booking
            setSelectedStations([]);
            resetFormToIndividualPreferences();
        }
        console.log("TeamMemberIds after fetch: ", teamMembers);  // This might still show the old value due to setState being asynchronous
    }
    const isManager = userInfo?.role  === "MANAGER";

    const handleTeamMemberChange = (e) => {
        const selectedMemberId = e.target.value;
        if (selectedMembers.includes(selectedMemberId)) {
            setSelectedMembers(selectedMembers.filter(id => id !== selectedMemberId));
        } else {
            setSelectedMembers([...selectedMembers, selectedMemberId]);
        }
    };

    const renderTeamMembersDropdown = () => (
        <select
            onChange={handleTeamMemberChange}
            className="form-control"
            multiple
            value={selectedMembers} // Assurez-vous de passer l'état actuel pour une sélection correcte
            size="5"
            style={{ height: '90px', overflowY: 'auto' }}
        >
            {teamList.map(member => (
                <option key={member.id} value={member.id}>
                    {member.firstname} {member.lastname} {selectedMembers.includes(member.id.toString()) ? "✓" : ""}
                </option>
            ))}
        </select>
    );
    if (!userInfo) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }
    return (
        <div>
            <div className="main">
                <h2>Make your choices</h2>
                <div className="add-reservation-container">
                    <div>
                        <div className="form-container">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label>Date</label>
                                    <div className="date-timePeriod">
                                        <div className="datepicker-container">
                                            <span className="datepicker-icon">📅</span>
                                            <DatePicker
                                                selected={date}
                                                onChange={(date) => setDate(date)}
                                                dateFormat="yyyy-MM-dd"
                                                minDate={minDate}
                                                maxDate={oneMonthLater}
                                                filterDate={combinedDateFilter}
                                                toggleCalendarOnIconClick
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="checkbox-container">
                                            <input
                                                type="checkbox"
                                                name="morning"
                                                className="checkbox"
                                                checked={timePeriod.morning}
                                                onChange={handleTimePeriodCheckboxChange}
                                            />
                                            <label className="checkbox-label">Morning</label>

                                            <input
                                                type="checkbox"
                                                name="afternoon"
                                                className="checkbox"
                                                checked={timePeriod.afternoon}
                                                onChange={handleTimePeriodCheckboxChange}
                                            />
                                            <label className="checkbox-label">Afternoon</label>
                                        </div>
                                    </div>
                                    {/* Ajout d'une option pour sélectionner une réservation de groupe */}
                                    <div className="group_booking">
                                    {isManager ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            {/* Conteneur pour le checkbox "Group Booking" et son label */}
                                            <div style={{ flex: '1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={isGroupBooking}
                                                    onChange={handleGroupBookingChange}
                                                />
                                                <label>Group Booking</label>
                                            </div>

                                            {/* Conditionnellement afficher le champ "Number of Team Members" si isGroupBooking est vrai */}
                                             {isGroupBooking && renderTeamMembersDropdown()}
                                            {/*(*/}
                                            {/*    <div style={{ flex: '0 1 150px', display: 'flex', alignItems: 'center', gap: '10px' }}>*/}
                                            {/*        <label>Res number</label>*/}
                                            {/*        <input*/}
                                            {/*            type="text"*/}
                                            {/*            value={teamMembers.length}*/}
                                            {/*            disabled={true}*/}
                                            {/*            className="form-control"*/}
                                            {/*            style={{ width: '50%' }} // L'input utilise toute la largeur du div*/}
                                            {/*        />*/}
                                            {/*    </div>*/}
                                            {/*)}*/}
                                        </div>
                                    ) : null}
                                </div>

                                    <div className="selectDetails">
                                        <div className="mb-3">
                                            <label>Reservation Type</label>
                                            <select
                                                name="reservationTypeId"
                                                value={reservationType}
                                                onChange={(e) => setReservationType(e.target.value)}
                                                className="form-select"
                                                disabled={isGroupBooking}
                                            >
                                                <option value="">Any</option>
                                                {data.reservationTypes.map((type) => (
                                                    <option key={type.id} value={type.id}>
                                                        {type.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label>WorkArea Type</label>
                                            <select
                                                value={workArea}
                                                onChange={(e) => setWorkArea(e.target.value)}
                                                className="form-select"
                                                aria-label="Default select example"
                                                name="workAreaId"
                                                disabled={isGroupBooking}
                                            >
                                                <option value="">Any</option>
                                                {data.workAreas.map((area) => (
                                                    <option key={area.id} value={area.id}>
                                                        {area.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label>Screen</label>
                                            <select
                                                value={screen}
                                                onChange={(e) => setScreen(e.target.value)}
                                                className="form-select"
                                                aria-label="Default select example"
                                                name="screenId"
                                                disabled={isGroupBooking}
                                            >
                                                <option value="">Any</option>
                                                {data.screens.map((screen) => (
                                                    <option key={screen.id} value={screen.id}>
                                                        {screen.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <div className="mb-3">
                                                <label>Equipment</label>
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        checked={isAnyEquipmentChecked}
                                                        onChange={handleAnyEquipmentChange}
                                                        className="form-check-input"
                                                        disabled={isGroupBooking}
                                                    />{" "}
                                                    Any
                                                </div>
                                                {data.equipment.map((equip) => (
                                                    <div key={equip.id} className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            value={equip.id}
                                                            checked={
                                                                !isAnyEquipmentChecked &&
                                                                equipment.includes(equip.id)
                                                            }
                                                            onChange={() => handleEquipmentChange(equip.id)}
                                                            className="form-check-input"
                                                        />{" "}
                                                        {equip.name}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mb-3">
                                                <label>Furniture</label>
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        checked={isAnyFurnitureChecked}
                                                        onChange={handleAnyFurnitureChange}
                                                        className="form-check-input"
                                                        disabled={isGroupBooking}
                                                    />{" "}
                                                    Any
                                                </div>
                                                {data.furniture.map((furn) => (
                                                    <div key={furn.id}>
                                                        <input
                                                            type="checkbox"
                                                            value={furn.id}
                                                            checked={
                                                                !isAnyFurnitureChecked &&
                                                                furniture.includes(furn.id)
                                                            }
                                                            onChange={() => handleFurnitureChange(furn.id)}
                                                            className="form-check-input"
                                                        />{" "}
                                                        {furn.name}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="container-submit">
                                    <button onClick={handleSubmit} className="btn btn-primary">
                                        Search
                                    </button>
                                </div>
                                {errorMessage && (
                                    <div style={{color: "red"}} className="error-message">
                                        {errorMessage}
                                    </div>
                                )}
                            </form>
                            <div>
                                {/*  {Array.from({ length: totalPages }, (_, index) => (*/}
                                {/*      <button key={index} onClick={() => handlePageChange(index)}>*/}
                                {/*        {index + 1}*/}
                                {/*      </button>*/}
                                {/*  ))}*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
