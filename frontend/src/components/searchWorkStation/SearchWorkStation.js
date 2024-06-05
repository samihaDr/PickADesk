import React, {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../../services/GlobalState";
import {getBookingPreferencesData} from "../../services/GetBookingPreferencesData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./SearchWorkStation.scss";
import {WorkStationContext} from "../../services/WorkStationContext";
import {useTeamList} from "../hooks/useTeamList";
import {AUTH_TOKEN_KEY} from "../../App";
import axios from "axios";
import notify from "../../services/toastNotifications";

export default function SearchWorkStation({onFormSend}) {
    const [data, setData] = useState({
        reservationTypes: [],
        workAreas: [],
        screens: [],
        equipment: [],
        furniture: [],
    });

    const {
        workStations, setWorkStations, setSelectedOptions,
        isGroupBooking, setIsGroupBooking,
        teamMembers, setTeamMembers,
        selectedStations, setSelectedStations,
        selectedMembers, setSelectedMembers,
        isColleagueBooking, setColleagueBooking,
        selectedColleague, setSelectedColleague,
        totalPages, setTotalPages,
        currentPage, setCurrentPage
    } = useContext(WorkStationContext);

    const [userList, setUserList] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const {userInfo = {}, userPreferences} = useContext(GlobalContext);
    const [isAnyEquipmentChecked, setIsAnyEquipmentChecked] = useState(false);
    const [isAnyFurnitureChecked, setIsAnyFurnitureChecked] = useState(false);
    const {teamList, fetchTeamList, isLoading: isTeamListLoading, error: teamListError} = useTeamList();
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
        console.log("IsColleagueBooking in SearchWorkStation : ", isColleagueBooking);
        fetchData();

    }, []);

    useEffect(() => {
        if (isGroupBooking && selectedMembers) {
            console.log("SelectedMembers : ", selectedMembers);
        }
    }, [isGroupBooking, selectedMembers]);

    useEffect(() => {
        if (isColleagueBooking && userList) {
            console.log("isColleagueBooking 11111111 : ", isColleagueBooking);
            console.log("UserList 11111111 : ", userList);
        }
    }, [isColleagueBooking, userList]);

    useEffect(() => {
        resetFormToIndividualPreferences();
    }, [userPreferences, isGroupBooking]);

    useEffect(() => {
        loadWorkStations();
    }, [currentPage]);

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
            notify.error(validationError);
            return;
        }
        setLoading(true);

        try {
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
                isColleagueBooking,
                teamMembers,
                selectedStations,
                selectedColleague

            };

            const response = await loadWorkStations(formData);

            if (response) {
                setWorkStations(response.content || []);
                setTotalPages(response.totalPages || 0);
                setCurrentPage(response.number || 0);
            } else {
                console.error("No response or bad format");
            }

            setSelectedOptions({
                zone,
                date,
                timePeriod,
                reservationType,
                workArea,
                isGroupBooking,
                isColleagueBooking,
                teamMembers,
                selectedStations,
                selectedColleague,

            });

            onFormSend(); // Déclencher la mise à jour d'état dans le parent
        } catch (error) {
            notify.error(error.message || "An error occurred while submitting the form");
        } finally {
            setLoading(false);
        }
    };

    const loadWorkStations = async () => {
        setLoading(true);
        const params = new URLSearchParams({
            reservationDate: date.toISOString().split("T")[0],
            morning: timePeriod.morning,
            afternoon: timePeriod.afternoon,
            zoneId: zone,
            reservationType: reservationType,
            workAreaId: workArea,
            screenId: screen,
            equipmentIds: equipment.join(","),
            furnitureIds: furniture.join(","),
            isGroupBooking: isGroupBooking,
            isColleagueBooking: isColleagueBooking,
            teamMembers: teamMembers.join(","),
            selectedStations: selectedStations.join(","),
            selectedColleague: selectedColleague,
            page: currentPage,
            size: 10, // Adaptez ceci selon vos besoins
            sortBy: "id",
            order: "asc",
        });

        try {
            const response = await fetch(`/api/workStations/search?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setWorkStations(data.content || []);
            setTotalPages(data.totalPages || 0);
            setCurrentPage(data.number || 0);

        } catch (error) {
            notify.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        console.log("Updated state - workStations: ", workStations);
        console.log("Updated state - totalPages: ", totalPages);
        console.log("Updated state - currentPage: ", currentPage);
    }, [workStations, totalPages, currentPage]);

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
            setColleagueBooking(false);
            try {
                const teamMembersAll = await fetchTeamList(userInfo.teamId, jwt);
                const ids = teamMembersAll.map(member => member.id);
                setTeamMembers(ids);  // Mettre à jour l'état avec les IDs récupérés
                const stationIds = selectedStations.map(station => station.id);
                console.log("Selected stations in SearchWorkStatiojs: ", stationIds);
                const teamDayId = data.reservationTypes.find(reservationType => reservationType.name === "Team day")?.id || "";

                setReservationType(teamDayId);
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

    const isManager = userInfo?.role === "MANAGER";

    const handleTeamMemberChange = (e) => {
        const selectedMemberId = e.target.value;
        if (selectedMembers.includes(selectedMemberId)) {
            setSelectedMembers(selectedMembers.filter(id => id !== selectedMemberId));
        } else {
            setSelectedMembers([...selectedMembers, selectedMemberId]);
        }
    };
    const fetchEmployeeList = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/users/allUsers`, {
                headers: {Authorization: `Bearer ${jwt}`},
            });
            const sortedData = response.data.sort((a, b) =>
                a.lastname.localeCompare(b.lastname),
            );
            setUserList(sortedData);

        } catch (error) {
            setErrorMessage("Unable to load the list of employees.");
        } finally {
            setLoading(false);
        }
    };
    const handleColleagueBookingChange = (e) => {
        const isChecked = e.target.checked;
        setColleagueBooking(isChecked);
        if (isChecked) {
            setIsGroupBooking(false);
            fetchEmployeeList();
        } else {
            resetFormToIndividualPreferences();
        }
    };
    const handleColleagueChange = (e) => {
        setSelectedColleague(e.target.value);
        console.log("SelectedColleague : ", selectedColleague);
    };
    const renderTeamMembersDropdown = () => (
        <select
            onChange={handleTeamMemberChange}
            className="form-control"
            multiple
            value={selectedMembers} // Assurez-vous de passer l'état actuel pour une sélection correcte
            style={{height: '70px', overflowY: 'auto'}}
        >
            {teamList.map(member => (
                <option key={member.id} value={member.id}>
                    {member.lastname} {member.firstname} {selectedMembers.includes(member.id.toString()) ? "✓" : ""}
                </option>
            ))}
        </select>
    );

    const renderUserListDropdown = () => (
        <select
            onChange={handleColleagueChange}
            className="form-control"
            value={selectedColleague} // Assurez-vous de passer l'état actuel pour une sélection correcte
             // size="5"
            style={{height: '45px', overflowY: 'auto'}}
        >
            {userList.map(user => (
                <option key={user.id} value={user.id}>
                    {user.lastname} {user.firstname}
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
                                    {/* Ajout d'une option pour sélectionner une réservation pour un collégue */}
                                    <div className="colleague_booking">

                                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                            {/* Conteneur pour le checkbox "Colleague Booking" et son label */}
                                            <div style={{
                                                flex: '1',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px'
                                            }}>
                                                <input style={{width: '20px'}}
                                                       type="checkbox"
                                                       checked={isColleagueBooking}
                                                       onChange={handleColleagueBookingChange}
                                                />
                                                <label>Book for a colleague</label>
                                            </div>

                                            {/* Conditionnellement afficher le champ "Number of Team Members" si isGroupBooking est vrai */}
                                            {isColleagueBooking && renderUserListDropdown()}
                                        </div>

                                    </div>
                                    {/* Ajout d'une option pour sélectionner une réservation de groupe */}
                                    <div className="group_booking">
                                        {isManager ? (
                                            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                                {/* Conteneur pour le checkbox "Group Booking" et son label */}
                                                <div style={{
                                                    flex: '1',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px'
                                                }}>
                                                    <input style={{width: '20px'}}
                                                           type="checkbox"
                                                           checked={isGroupBooking}
                                                           onChange={handleGroupBookingChange}
                                                    />
                                                    <label>Group Booking</label>
                                                </div>

                                                {/* Conditionnellement afficher le champ "Number of Team Members" si isGroupBooking est vrai */}
                                                {isGroupBooking && renderTeamMembersDropdown()}
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}