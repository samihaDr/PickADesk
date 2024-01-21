import axios from "axios";

export async function getLocationData() {
  try {
    const [countriesResponse, citiesResponse, officesResponse, zonesResponse] =
      await Promise.all([
        axios.get(`/api/countries`),
        axios.get(`/api/cities/getCities`),
        axios.get(`/api/offices/getOffices`),
        axios.get(`/api/zones/getZones`),
      ]);
    return {
      countries: countriesResponse.data,
      cities: citiesResponse.data,
      offices: officesResponse.data,
      zones: zonesResponse.data,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des données", error);
    return {
      countries: [],
      cities: [],
      offices: [],
      zones: [],
    };
  }
}
