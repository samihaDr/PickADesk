import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../services/GlobalState";
import { getLocationData } from "../../services/GetLocationData";
import { getBookingPreferencesData } from "../../services/GetBookingPreferencesData";

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
  const [date, setDate] = useState("");
  const [timePeriod, setTimePeriod] = useState({
    morning: false,
    afternoon: false,
  });
  // const [date, setDate] = useState(userPreferences.date || '');
  // const [timePeriod, setTimePeriod] = useState({
  //     morning: userPreferences.timePeriod?.morning || false,
  //     afternoon: userPreferences.timePeriod?.afternoon || false
  // });
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
    fetchData();
  }, []);

  useEffect(() => {
    if (userPreferences) {
      setDate(userPreferences.date || "");
      setTimePeriod({
        morning: userPreferences.timePeriod?.morning || false,
        afternoon: userPreferences.timePeriod?.afternoon || false,
      });
      setReservationType(userPreferences.reservationType?.id || "");
      setWorkArea(userPreferences.workArea?.id || "");
      setScreen(userPreferences.screen?.id || "");
      setEquipment(userPreferences.equipment || []);
      setFurniture(userPreferences.furniture || []);
    }
  }, [userPreferences]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle form submission
    console.log({
      date,
      timePeriod,
      reservationType,
      workArea,
      screen,
      equipment,
      furniture,
    });
  };
  console.log("MON OBJET IN SEARCH ...... : ", {
    date,
    timePeriod,
    reservationType,
    workArea,
    screen,
    equipment,
    furniture,
  });
  const handleCheckboxChange = (e) => {
    setTimePeriod({
      ...timePeriod,
      [e.target.name]: e.target.checked,
    });
  };

  const handleEquipmentChange = (e) => {
    if (e.target.checked) {
      setEquipment([...equipment, e.target.value]);
    } else {
      setEquipment(equipment.filter((item) => item !== e.target.value));
    }
  };
  if (!userConnected) {
    return null; // Ne rien rendre si l'utilisateur n'est pas connecté
  }

  return (
    <div>
      <div className="main">
        <h2 style={{ color: "#1f4e5f" }}>Choose your workstation!</h2>
        <div className="add-reservation-container">
          <div>
            <div className="form-container">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label>Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label>Morning</label>
                  <input
                    type="checkbox"
                    name="morning"
                    checked={timePeriod.morning}
                    onChange={handleCheckboxChange}
                  />
                  <label>Afternoon</label>
                  <input
                    type="checkbox"
                    name="afternoon"
                    checked={timePeriod.afternoon}
                    onChange={handleCheckboxChange}
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
                    <label>Equipments</label>
                    {data.equipment.map((equip) => (
                      <div key={equip.id}>
                        <input
                          type="checkbox"
                          value={equip.id}
                          checked={equipment.includes(equip.id)}
                          onChange={handleEquipmentChange}
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
                          onChange={handleEquipmentChange} // Assuming the same function for furniture
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
