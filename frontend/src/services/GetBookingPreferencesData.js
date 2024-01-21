import axios from "axios";

export async function getBookingPreferencesData() {
  try {
    const [
      reservationTypesResponse,
      workAreasResponse,
      screensResponse,
      equipmentResponse,
      furnitureResponse,
    ] = await Promise.all([
      axios.get(`/api/reservationTypes`),
      axios.get(`/api/workAreas`),
      axios.get(`/api/screens`),
      axios.get(`/api/equipments`),
      axios.get(`/api/furnitures`),
    ]);
    return {
      reservationTypes: reservationTypesResponse.data,
      workAreas: workAreasResponse.data,
      screens: screensResponse.data,
      equipment: equipmentResponse.data,
      furniture: furnitureResponse.data,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des données", error);
    return {
      reservationTypes: [],
      workAreas: [],
      screens: [],
      equipment: [],
      furniture: [],
    };
  }
}
