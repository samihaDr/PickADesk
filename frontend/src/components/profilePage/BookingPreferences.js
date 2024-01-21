const BookingPreferences = ({
  formData,
  updateBookingPreferences,
  userPreferences,
}) => {
  const hasUserPrefs =
    userPreferences && Object.keys(userPreferences).length > 0;

  // Utiliser directement l'objet pour les préférences initiales
  const initialReservationType =
    userPreferences.reservationType ?? formData.reservationType;
  const initialWorkArea = userPreferences.workArea ?? formData.workArea;
  const initialScreen = userPreferences.screen ?? formData.screen;

  // Gérer les équipements et les meubles comme des listes d'objets
  const initialEquipments = userPreferences.equipment ?? formData.equipment;
  const initialFurnitures = userPreferences.furniture ?? formData.furniture;

  const handleCheckboxChange = (field, itemId) => {
    const isItemInList = formData[field].some((item) => item.id === itemId);
    const updatedList = isItemInList
      ? formData[field].filter((item) => item.id !== itemId)
      : [...formData[field], { id: itemId }];

    updateBookingPreferences(field, updatedList);
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
                value={initialReservationType?.name || ""}
                disabled
              />
            ) : (
              <select
                name="reservationTypeId"
                onChange={(e) =>
                  updateBookingPreferences(e.target.name, e.target.value)
                }
                className="form-select"
                value={initialReservationType}
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
                value={initialWorkArea?.name || ""}
                disabled
              />
            ) : (
              <select
                name="workAreaId"
                onChange={(e) =>
                  updateBookingPreferences(e.target.name, e.target.value)
                }
                className="form-select"
                value={initialWorkArea}
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
                value={initialScreen?.name || ""}
                disabled
              />
            ) : (
              <select
                name="screenId"
                onChange={(e) =>
                  updateBookingPreferences(e.target.name, e.target.value)
                }
                className="form-select"
                value={initialScreen}
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
                    checked={initialEquipments.some(
                      (e) => e.id === equipment.id,
                    )}
                    onChange={() =>
                      handleCheckboxChange("equipmentIds", equipment.id)
                    }
                    className="form-check-input"
                    disabled={hasUserPrefs} // Les cases à cocher seront désactivées si l'utilisateur a des préférences
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
                    checked={initialFurnitures.some(
                      (e) => e.id === furniture.id,
                    )}
                    onChange={() =>
                      handleCheckboxChange("furnitureIds", furniture.id)
                    }
                    className="form-check-input"
                    disabled={hasUserPrefs} // Les cases à cocher seront désactivées si l'utilisateur a des préférences
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
