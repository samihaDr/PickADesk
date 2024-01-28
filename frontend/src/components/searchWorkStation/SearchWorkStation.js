import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../services/GlobalState";
import { getBookingPreferencesData } from "../../services/GetBookingPreferencesData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // CSS import
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
  const [errorMessage, setErrorMessage] = useState("");
  const { userConnected, userPreferences } = useContext(GlobalContext);
  const [date, setDate] = useState(new Date());
  const today = new Date();
  let minDate = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(today.getMonth() + 1);

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 pour dimanche, 6 pour samedi
  };
  if (today.getHours() >= 13) {
    minDate.setDate(today.getDate() + 1);
  }

  const isDateSelectable = (date) => {
    return date >= minDate;
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

  const validateFormData = () => {
    // Vérifier que la date est sélectionnée et valide
    if (!date) {
      return "The date is compulsory.";
    }

    // Vérifier que la date sélectionnée n'est pas dans le passé
    if (date <= today) {
      return "The date selected cannot be in the past.";
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
    const validationError = validateFormData();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    setErrorMessage("");
    setLoading(true);

    const formData = {
      startDate: date,
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
    } finally {
      setLoading(false);
    }
  };

  const sendFormDataToServer = async (formData) => {
    const {
      //startDate,  // Note: Vous devrez peut-être adapter ce champ en fonction de la façon dont votre backend gère les dates
      //timePeriod, // Note: Ce champ n'est pas directement utilisé dans le backend, à moins qu'il ne corresponde à 'zoneId'
      zone,
      workArea,
      screen,
      equipment,
      furniture,
    } = formData;

    const params = new URLSearchParams({
      zoneId: zone,
      workAreaId: workArea,
      screenId: screen,
      // Convertir les tableaux en chaînes de requête, par exemple: "1,2,3"
      equipmentIds: equipment.join(","),
      furnitureIds: furniture.join(","),
      // Paramètres de pagination par défaut, modifiez-les si nécessaire
      page: 0,
      size: 10,
      sortBy: "id",
      order: "asc",
    });

    try {
      const response = await fetch(`/api/workStations/search?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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

  const handleCheckboxChange = (itemId, category) => {
    const isEquipment = category === "equipment";
    const selectedItems = isEquipment ? equipment : furniture;
    const newItems = selectedItems.includes(itemId)
      ? selectedItems.filter((id) => id !== itemId)
      : [...selectedItems, itemId];

    isEquipment ? setEquipment(newItems) : setFurniture(newItems);
  };
  if (!userConnected) {
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
        <h2 style={{ color: "#1f4e5f" }}>Make a reservation!</h2>
        <div className="add-reservation-container">
          <div>
            <div className="form-container">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label>Date</label>
                  <div className="datepicker-container">
                    <span className="datepicker-icon">📅</span>
                    <DatePicker
                      selected={date}
                      onChange={(date) => setDate(date)}
                      dateFormat="dd/MM/yyyy"
                      minDate={minDate}
                      maxDate={oneMonthLater}
                      filterDate={isDateSelectable}
                      filterDate={isWeekday}
                      toggleCalendarOnIconClick
                      className="form-control"
                    />
                  </div>
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
                <div className="mb-3">
                  <label>Reservation Type</label>
                  <select
                    name="reservationTypeId"
                    value={reservationType}
                    onChange={(e) => setReservationType(e.target.value)}
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
                    {data.equipment.map((equip) => (
                      <div key={equip.id} className="form-check">
                        <input
                          type="checkbox"
                          value={equip.id}
                          checked={equipment.includes(equip.id)}
                          onChange={() =>
                            handleCheckboxChange(equip.id, "equipment")
                          }
                          className="form-check-input"
                        />{" "}
                        {equip.name}
                      </div>
                    ))}
                  </div>
                  <div className="mb-3">
                    <label>Furniture</label>
                    {data.furniture.map((furn) => (
                      <div key={furn.id}>
                        <input
                          type="checkbox"
                          value={furn.id}
                          checked={furniture.includes(furn.id)}
                          onChange={() =>
                            handleCheckboxChange(furn.id, "furniture")
                          }
                          className="form-check-input"
                        />{" "}
                        {furn.name}
                      </div>
                    ))}
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
