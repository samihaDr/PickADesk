import React from "react";

const BookingPreferences = ({ formData, updatePreference }) => {
  const handleCheckboxChange = (field, value) => {
    const updatedValues = formData[field].includes(value)
      ? formData[field].filter((item) => item !== value)
      : [...formData[field], value];
    updatePreference(field, updatedValues);
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
            <select
              name="reservationTypeId"
              onChange={(e) => updatePreference(e.target.name, e.target.value)}
              className="form-select"
              value={formData.reservationTypeId}
            >
              <option value="">Select a Reservation Type</option>
              {formData.reservationTypes &&
                formData.reservationTypes.map((reservationType) => (
                  <option key={reservationType.id} value={reservationType.id}>
                    {reservationType.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-3">
            <label>Work Area</label>
            <select
              name="workAreaId"
              onChange={(e) => updatePreference(e.target.name, e.target.value)}
              className="form-select"
              value={formData.workAreaId}
            >
              <option value="">Select a Work area</option>
              {formData.workAreas &&
                formData.workAreas.map((workArea) => (
                  <option key={workArea.id} value={workArea.id}>
                    {workArea.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-3">
            <label>Screen</label>
            <select
              name="screenId"
              onChange={(e) => updatePreference(e.target.name, e.target.value)}
              className="form-select"
              value={formData.screenId}
            >
              <option value="">Select a screen</option>
              {formData.screens &&
                formData.screens.map((screen) => (
                  <option key={screen.id} value={screen.id}>
                    {screen.name}
                  </option>
                ))}
            </select>
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
                    checked={formData.equipmentIds?.includes(equipment.id)}
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
                    checked={formData.furnitureIds?.includes(furniture.id)}
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
