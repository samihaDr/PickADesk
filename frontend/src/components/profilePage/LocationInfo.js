import axios from "axios";
import { useEffect, useState } from "react";

const LocationInfo = ({ userPreferences, formData, handleChange }) => {
  const [initialCities, setInitialCities] = useState([]);
  const [initialOffices, setInitialOffices] = useState([]);
  const [initialZones, setInitialZones] = useState([]);
  const [loading, setLoading] = useState(true);
  //const userPrefs = userPreferences?.[0] ?? {};

  const initialCountryId =
    userPreferences.countryId ?? formData.countryId ?? "";
  const initialCityId = userPreferences.cityId ?? formData.cityId ?? "";
  const initialOfficeId = userPreferences.officeId ?? formData.officeId ?? "";
  const initialZoneId = userPreferences.zoneId ?? formData.zoneId ?? "";

  // Cette variable détermine si l'utilisateur a déjà des préférences
  //const hasUserPrefs = userPrefs && Object.keys(userPrefs).length > 0;
  const hasUserPrefs = userPreferences.length !== 0;
  console.log("hasUserPrefs in LocationINfo : ", hasUserPrefs);
  // Recuperation des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesResponse, officesResponse, zonesResponse] =
          await Promise.all([
            axios.get(`/api/cities/getCities`),
            axios.get(`/api/offices/getOffices`),
            axios.get(`/api/zones/getZones`),
          ]);
        setInitialCities(citiesResponse.data);
        setInitialOffices(officesResponse.data);
        setInitialZones(zonesResponse.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const findNameById = (list, id) => {
    // console.log("FindNAmeById   :   ", list);
    return list.find((item) => item.id === id)?.name ?? "Not found";
  };

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
                  value={findNameById(
                    formData.countries,
                    userPreferences.countryId,
                  )}
                  disabled
                />
              ) : (
                <select
                  name="countryId"
                  onChange={handleChange}
                  className="form-select"
                  value={initialCountryId}
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
                  value={findNameById(initialCities, userPreferences.cityId)}
                  disabled
                />
              ) : (
                <select
                  name="cityId"
                  onChange={handleChange}
                  className="form-select"
                  value={initialCityId}
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
                  value={findNameById(initialOffices, userPreferences.officeId)}
                  disabled
                />
              ) : (
                <select
                  name="officeId"
                  onChange={handleChange}
                  className="form-select"
                  value={initialOfficeId}
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
                  value={findNameById(initialZones, userPreferences.zoneId)}
                  disabled
                />
              ) : (
                <select
                  name="zoneId"
                  onChange={handleChange}
                  className="form-select"
                  value={initialZoneId}
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
