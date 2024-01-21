import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../services/GlobalState";
import { getBookingPreferencesData } from "../../services/GetBookingPreferencesData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // CSS import
export default function SearchWorkStation() {
  const [data, setData] = useState({
    reservationTypes: [],
    workAreas: [],
    screens: [],
    equipment: [],
    furniture: [],
  });

  const [loading, setLoading] = useState(true);
  const { userConnected, userPreferences } = useContext(GlobalContext);
  const [date, setDate] = useState(new Date());
  const [timePeriod, setTimePeriod] = useState({
    morning: false,
    afternoon: false,
  });

  const [reservationType, setReservationType] = useState("");
  const [workArea, setWorkArea] = useState("");
  const [screen, setScreen] = useState("");
  const [equipment, setEquipment] = useState([]);
  const [furniture, setFurniture] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const bookingPreferencesData = await getBookingPreferencesData();
      setData(bookingPreferencesData);
      setLoading(false);
    }
    //console.log("Booking Preferences equipment DATA : ", data.equipment);
    //console.log("Booking Preferences furniture DATA : ", data.furniture);
    fetchData();
  }, []);

  useEffect(() => {
    if (userPreferences) {
      setReservationType(userPreferences.reservationType?.id || "");
      setWorkArea(userPreferences.workArea?.id || "");
      setScreen(userPreferences.screen?.id || "");
      setEquipment(userPreferences.equipment.map((e) => e.id) || []);
      setFurniture(userPreferences.furniture.map((f) => f.id) || []);
    }
  }, [userPreferences]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle form submission
    console.log({
      startDate: date,
      timePeriod,
      reservationType,
      workArea,
      screen,
      equipment,
      furniture,
    });
  };
  console.log("MON OBJET IN SEARCH ...... : ", {
    startDate: date,
    timePeriod,
    reservationType,
    workArea,
    screen,
    equipment,
    furniture,
  });
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
    return null; // Ne rien rendre si l'utilisateur n'est pas connecté
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
                  <DatePicker
                    showIcon
                    selected={date}
                    onChange={(date) => setDate(date)}
                    dateFormat="dd/MM/yyyy"
                    toggleCalendarOnIconClick
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label>Morning</label>
                  <input
                    type="checkbox"
                    name="morning"
                    checked={timePeriod.morning}
                    onChange={handleTimePeriodCheckboxChange}
                  />
                  <label>Afternoon</label>
                  <input
                    type="checkbox"
                    name="afternoon"
                    checked={timePeriod.afternoon}
                    onChange={handleTimePeriodCheckboxChange}
                  />
                </div>
                <div className="mb-3">
                  <label>Reservation Type</label>
                  <select
                    name="reservationTypeId"
                    value={reservationType}
                    onChange={(e) => setReservationType(e.target.value)}
                    className="form-select"
                  >
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
                        />{" "}
                        {furn.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="container-submit">
                  <button type="submit" className="btn btn-primary">
                    {" "}
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
