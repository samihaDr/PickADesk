// import React, { useEffect, useState } from "react";
// import axios from "axios";

const BookingPreferences = ({
  formData,
  updateBookingPreferences,
  userPreferences,
}) => {
  // const [initialReservationTypes, setInitialReservationTypes] = useState([]);
  // const [initialWorkAreas, setInitialWorkAreas] = useState([]);
  // const [initialScreens, setInitialScreens] = useState([]);
  // const [initialEquipments, setInitialEquipments] = useState([]);
  // const [initialFurnitures, setInitialFurnitures] = useState([]);
  // const [loading, setLoading] = useState(true);
  //const userPrefs = userPreferences?.[0] ?? {};

  console.log("UserPreferebces in BookingPreferences : ", userPreferences);
  console.log("FormData : ", formData);
  const initialReservationTypeId =
    userPreferences.reservationTypeId ?? formData.reservationTypeId ?? "";
  const initialWorkAreaId =
    userPreferences.workAreaId ?? formData.workAreaId ?? "";
  const initialScreenId = userPreferences.screenId ?? formData.screenId ?? "";
  const initialEquipmentIds =
    userPreferences.equipmentIds ?? formData.equipmentIds ?? "";
  const initialFurnitureIds =
    userPreferences.furnitureIds ?? formData.furnitureIds ?? "";
  //const hasUserPrefs = userPrefs && Object.keys(userPrefs).length > 0;
  const hasUserPrefs = userPreferences.length !== 0;
  console.log("hasUserPrefs in BOoking Preferences : ", hasUserPrefs);

  const findNameById = (list, id) => {
    console.log("FindNAmeById   :   ", list);
    return list.find((item) => item.id === id)?.name ?? "Not found";
  };
  const handleCheckboxChange = (field, value) => {
    const updatedValues = formData[field].includes(value)
      ? formData[field].filter((item) => item !== value)
      : [...formData[field], value];
    updateBookingPreferences(field, updatedValues);
  };
  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingThree">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseThree"
          aria-expanded="false"
          aria-controls="collapseThree"
        >
          Booking Preferences
        </button>
      </h2>
      <div
        id="collapseThree"
        className="accordion-collapse collapse"
        aria-labelledby="headingThree"
        data-bs-parent="#accordionExample"
      >
        <div className="accordion-body">
          <div className="mb-3">
            <label>Reservation type</label>
            {hasUserPrefs ? (
              <input
                type="text"
                className="form-control"
                value={findNameById(
                  formData.reservationTypes,
                  userPreferences.reservationTypeId,
                )}
                disabled
              />
            ) : (
              <select
                name="reservationTypeId"
                onChange={(e) =>
                  updateBookingPreferences(e.target.name, e.target.value)
                }
                className="form-select"
                value={initialReservationTypeId}
              >
                <option value="">Select a Reservation Type</option>
                {formData.reservationTypes &&
                  formData.reservationTypes.map((reservationType) => (
                    <option key={reservationType.id} value={reservationType.id}>
                      {reservationType.name}
                    </option>
                  ))}
              </select>
            )}
          </div>
          <div className="mb-3">
            <label>Work Area</label>
            {hasUserPrefs ? (
              <input
                type="text"
                className="form-control"
                value={findNameById(
                  formData.workAreas,
                  userPreferences.workAreaId,
                )}
                disabled
              />
            ) : (
              <select
                name="workAreaId"
                onChange={(e) =>
                  updateBookingPreferences(e.target.name, e.target.value)
                }
                className="form-select"
                value={initialWorkAreaId}
              >
                <option value="">Select a Work area</option>
                {formData.workAreas &&
                  formData.workAreas.map((workArea) => (
                    <option key={workArea.id} value={workArea.id}>
                      {workArea.name}
                    </option>
                  ))}
              </select>
            )}
          </div>
          <div className="mb-3">
            <label>Screen</label>
            {hasUserPrefs ? (
              <input
                type="text"
                className="form-control"
                value={findNameById(formData.screens, userPreferences.screenId)}
                disabled
              />
            ) : (
              <select
                name="screenId"
                onChange={(e) =>
                  updateBookingPreferences(e.target.name, e.target.value)
                }
                className="form-select"
                value={initialScreenId}
              >
                <option value="">Select a screen</option>
                {formData.screens &&
                  formData.screens.map((screen) => (
                    <option key={screen.id} value={screen.id}>
                      {screen.name}
                    </option>
                  ))}
              </select>
            )}
          </div>
          <div className="mb-3">
            <label>Equipments</label>

            {formData.equipments &&
              formData.equipments.map((equipment) => (
                <div key={equipment.id} className="form-check">
                  <input
                    type="checkbox"
                    id={`equipment-${equipment.id}`}
                    name="equipmentIds"
                    value={equipment.id}
                    checked={initialEquipmentIds?.includes(equipment.id)}
                    onChange={() =>
                      handleCheckboxChange("equipmentIds", equipment.id)
                    }
                    className="form-check-input"
                  />
                  <label
                    htmlFor={`equipment-${equipment.id}`}
                    className="form-check-label"
                  >
                    {equipment.name}
                  </label>
                </div>
              ))}
          </div>

          <div className="mb-3">
            <label>Furniture</label>
            {formData.furnitures &&
              formData.furnitures.map((furniture) => (
                <div key={furniture.id} className="form-check">
                  <input
                    type="checkbox"
                    id={`furniture-${furniture.id}`}
                    name="furnitureIds"
                    value={furniture.id}
                    checked={initialFurnitureIds?.includes(furniture.id)}
                    onChange={() =>
                      handleCheckboxChange("furnitureIds", furniture.id)
                    }
                    className="form-check-input"
                  />
                  <label
                    htmlFor={`furniture-${furniture.id}`}
                    className="form-check-label"
                  >
                    {furniture.name}
                  </label>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPreferences;
