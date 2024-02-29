import { useEffect, useState } from "react";
import { getLocationData } from "../../services/GetLocationData";

const LocationInfo = ({ userPreferences, formData, handleChange }) => {
  const [data, setData] = useState({
    countries: [],
    cities: [],
    offices: [],
    zones: [],
  });
  const [loading, setLoading] = useState(true);

  const initialCountry = userPreferences.country ?? formData.country;
  const initialCity = userPreferences.city ?? formData.city;
  const initialOffice = userPreferences.office ?? formData.office;
  const initialZone = userPreferences.zone ?? formData.zone;

  const hasUserPrefs =
    userPreferences && Object.keys(userPreferences).length > 0;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const locationData = await getLocationData();
        setData({
          countries: locationData.countries,
          cities: locationData.cities,
          offices: locationData.offices,
          zones: locationData.zones,
        });
      } catch (error) {
        console.error("Error fetching location data:", error);
        // Gérez ici l'état d'erreur si nécessaire
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading form data...</div>;
  }

  // Vérification de la disponibilité des données pour le formulaire
  const isFormDataAvailable = formData && formData.countries;

  if (!isFormDataAvailable || !userPreferences) {
    return <div>Unable to load form data.</div>;
  }

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
            {/* Affichage conditionnel du sélecteur de pays */}

            <div className="mb-3">
              <label>Country</label>
              {hasUserPrefs ? (
                <input
                  type="text"
                  className="form-control"
                  value={initialCountry?.name || ""}
                  disabled
                />
              ) : (
                <select
                  name="countryId"
                  onChange={handleChange}
                  className="form-select"
                  value={initialCountry}
                >
                  <option value="">Select a Country</option>
                  {formData.countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Affichage conditionnel du sélecteur de villes */}

            <div className="mb-3">
              <label>City</label>
              {hasUserPrefs ? (
                <input
                  type="text"
                  className="form-control"
                  value={initialCity?.name || ""}
                  disabled
                />
              ) : (
                <select
                  name="cityId"
                  onChange={handleChange}
                  className="form-select"
                  value={initialCity}
                >
                  <option value="">Select a City</option>
                  {formData.cities?.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Affichage conditionnel du sélecteur de bureaux */}

            <div className="mb-3">
              <label>Office</label>
              {hasUserPrefs ? (
                <input
                  type="text"
                  className="form-control"
                  value={initialOffice?.name || ""}
                  disabled
                />
              ) : (
                <select
                  name="officeId"
                  onChange={handleChange}
                  className="form-select"
                  value={initialOffice}
                >
                  <option value="">Select a Office</option>
                  {formData.offices?.map((office) => (
                    <option key={office.id} value={office.id}>
                      {office.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {/* Affichage conditionnel du sélecteur de zones */}

            <div className="mb-3">
              <label>Zone</label>
              {hasUserPrefs ? (
                <input
                  type="text"
                  className="form-control"
                  value={initialZone?.name || ""}
                  disabled
                />
              ) : (
                <select
                  name="zoneId"
                  onChange={handleChange}
                  className="form-select"
                  value={initialZone}
                >
                  <option value="">Select a Zone</option>
                  {formData.zones?.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationInfo;
