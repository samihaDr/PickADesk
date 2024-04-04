import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../services/GlobalState";
import { getBookingPreferencesData } from "../../services/GetBookingPreferencesData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./SearchWorkStation.scss";
import { useNavigate } from "react-router-dom";
import { WorkStationContext } from "../../services/WorkStationContext";

export default function SearchWorkStation() {
  const [data, setData] = useState({
    reservationTypes: [],
    workAreas: [],
    screens: [],
    equipment: [],
    furniture: [],
  });

  const navigate = useNavigate();
  const { workStations, setWorkStations, setSelectedOptions } =
    useContext(WorkStationContext);
  const [isLoading, setLoading] = useState(true);
  const [openCollapse, setOpenCollapse] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { userInfo, userPreferences } = useContext(GlobalContext);
  const [isAnyEquipmentChecked, setIsAnyEquipmentChecked] = useState(false);
  const [isAnyFurnitureChecked, setIsAnyFurnitureChecked] = useState(false);
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
    if (userPreferences) {
      setZone(userPreferences.zone?.id || "");
      setReservationType(userPreferences.reservationType?.id || "");
      setWorkArea(userPreferences.workArea?.id || "");
      setScreen(userPreferences.screen?.id || "");
      setEquipment(userPreferences.equipment.map((e) => e.id) || []);
      setFurniture(userPreferences.furniture.map((f) => f.id) || []);
    }
  }, [userPreferences]);

  // Extrait montrant le gestionnaire d'événements et les boutons modifiés
  // Gestionnaire pour basculer l'état d'ouverture d'un collapse
  // Cette fonction bascule l'état d'ouverture pour un collapse donné
  const toggleCollapse = (collapseId) => {
    setOpenCollapse(openCollapse === collapseId ? null : collapseId);
  };

  // Fonction pour déterminer le style d'affichage basé sur l'état
  const collapseStyle = (collapseId) => ({
    display: openCollapse === collapseId ? "block" : "none",
  });
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
      });
      navigate("/availableWorkStations");
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
      workArea,
      screen,
      equipment, // Ce sont des listes d'IDs
      furniture, // Ce sont des listes d'IDs
    } = formData;

    const params = new URLSearchParams({
      reservationDate: date.toISOString().split("T")[0], // Convertit la date en format ISO (yyyy-MM-dd)
      morning: timePeriod.morning,
      afternoon: timePeriod.afternoon,
      zoneId: zone || "", // Si zone est null ou undefined, cela enverra une chaîne vide
      workAreaId: workArea || "",
      screenId: screen || "",
      equipmentIds: equipment.join(",") || "",
      furnitureIds: furniture.join(",") || "",
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
    } catch (error) {
      console.error("Error fetching data", error);
      throw error;
    }
  };

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
        <h2>Make a reservation</h2>
        <div className="buttons-container">
          {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
          <button
            className="btn btn-info"
            data-bs-toggle="collapse"
            data-bs-target="#selectDetails"
            role="button"
            onClick={() => toggleCollapse("selectDetails")}
            aria-expanded={openCollapse === "selectDetails"}
            aria-controls="selectDetails"
          >
            Select details
          </button>
          <button
            className="btn btn-info"
            role="button"
            data-bs-toggle="collapse"
            data-bs-target="#selectFavorite"
            onClick={() => toggleCollapse("selectFavorite")}
            aria-expanded={openCollapse === "selectFavorite"}
            aria-controls="selectFavorite"
          >
            Select favorite
          </button>
          <button
            className="btn btn-info"
            role="button"
            data-bs-toggle="collapse"
            data-bs-target="#selectOnPlan"
            onClick={() => toggleCollapse("selectOnPlan")}
            aria-expanded={openCollapse === "selectOnPlan"}
            aria-controls="selectOnPlan"
          >
            Select on plan
          </button>
        </div>
        <div className="add-reservation-container">
          <div>
            <div className="form-container">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div
                    style={collapseStyle("selectDetails")}
                    id="selectDetails"
                  >
                    <div className="collapse" id="selectDetails">
                      <div className="card card-body">
                        <div className="selectDetails">
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
                                <label className="checkbox-label">
                                  Morning
                                </label>

                                <input
                                  type="checkbox"
                                  name="afternoon"
                                  className="checkbox"
                                  checked={timePeriod.afternoon}
                                  onChange={handleTimePeriodCheckboxChange}
                                />
                                <label className="checkbox-label">
                                  Afternoon
                                </label>
                              </div>
                            </div>

                            <div className="mb-3">
                              <label>Reservation Type</label>
                              <select
                                name="reservationTypeId"
                                value={reservationType}
                                onChange={(e) =>
                                  setReservationType(e.target.value)
                                }
                                className="form-select"
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
                                      onChange={() =>
                                        handleEquipmentChange(equip.id)
                                      }
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
                                      onChange={() =>
                                        handleFurnitureChange(furn.id)
                                      }
                                      className="form-check-input"
                                    />{" "}
                                    {furn.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div
                      style={collapseStyle("selectFavorite")}
                      id="selectFavorite"
                    >
                      <div className="collapse" id="selectFavorite">
                        <div className="card card-body">
                          <div className="selectFavorite">
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
                                  <label className="checkbox-label">
                                    Morning
                                  </label>

                                  <input
                                    type="checkbox"
                                    name="afternoon"
                                    className="checkbox"
                                    checked={timePeriod.afternoon}
                                    onChange={handleTimePeriodCheckboxChange}
                                  />
                                  <label className="checkbox-label">
                                    Afternoon
                                  </label>
                                </div>
                              </div>
                            </div>
                            Some placeholder content for the second collapse
                            component of this multi-collapse example. This panel
                            is hidden by default but revealed when the user
                            activates the relevant trigger.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div
                      style={collapseStyle("selectOnPlan")}
                      id="selectOnPlan"
                    >
                      <div className="selectOnPlan">
                        <div className="collapse" id="selectOnPlan">
                          <div className="card card-body">
                            Some placeholder content for the second collapse
                            component of this multi-collapse example. This panel
                            is hidden by default but revealed when the user
                            activates the relevant trigger. Some placeholder
                            content for the second collapse component of this
                            multi-collapse example. This panel is hidden by
                            default but revealed when the user activates the
                            relevant trigger.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="container-submit">
                  <button type="submit" className="btn btn-primary">
                    Search
                  </button>
                </div>
                {errorMessage && (
                  <div style={{ color: "red" }} className="error-message">
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
