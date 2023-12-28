import React from "react";

const LocationInfo = ({ formData, handleChange }) => {
  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingTwo">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseTwo"
          aria-expanded="true"
          aria-controls="collapseTwo"
        >
          Location Infos
        </button>
      </h2>
      <div
        id="collapseTwo"
        className="accordion-collapse collapse"
        aria-labelledby="headingTwo"
        data-bs-parent="#accordionExample"
      >
        <div className="accordion-body">
          <div className="formLocationInfo-container">
            <form>
              <div className="mb-3">
                <label>Country</label>
                <select
                  name="countryId"
                  onChange={handleChange}
                  className="form-select"
                  value={formData.countryId}
                >
                  <option value="">Select a Country</option>
                  {formData.countries &&
                    formData.countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-3">
                <label>City</label>
                <select
                  name="cityId"
                  onChange={handleChange}
                  className="form-select"
                  value={formData.cityId}
                >
                  <option value="">Select a City</option>
                  {formData.cities &&
                    formData.cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-3">
                <label>Office</label>
                <select
                  name="officeId"
                  onChange={handleChange}
                  className="form-select"
                  value={formData.officeId}
                >
                  <option value="">Select a Office</option>
                  {formData.offices &&
                    formData.offices.map((office) => (
                      <option key={office.id} value={office.id}>
                        {office.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-3">
                <label>Zone</label>
                <select
                  name="zoneId"
                  onChange={handleChange}
                  className="form-select"
                  value={formData.zoneId}
                >
                  <option value="">Select a Zone</option>
                  {formData.zones &&
                    formData.zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                </select>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationInfo;
