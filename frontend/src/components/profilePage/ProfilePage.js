import React, { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { GlobalContext } from "../../services/GlobalState";
import { getUserConnected } from "../../services/GetUserConnected";
import "./ProfilePage.scss";
import PersonalInfo from "./PersonalInfo";
import LocationInfo from "./LocationInfo";
import BookingPreferences from "./BookingPreferences";

const initialState = {
  formData: {
    lastname: "",
    firstname: "",
    department: "",
    team: "",
    countries: [],
    cities: [],
    offices: [],
    zones: [],
    countryId: "",
    cityId: "",
    officeId: "",
    zoneId: "",
    reservationTypes: [],
    workAreas: [],
    equipments: [],
    screens: [],
    furnitures: [],
    reservationTypeId: "",
    workAreaId: "",
    equipmentIds: [],
    screenId: "",
    furnitureIds: [],
  },

  error: "",
  isLoading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
        isLoading: false,
      };
    case "FETCH_FAILURE":
      return { ...state, error: action.payload, isLoading: false };
    case "START_FETCH":
      return { ...state, isLoading: true };
    case "UPDATE_FIELD":
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
      };
    case "UPDATE_LOCATIONS":
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case "UPDATE_BOOKING_PREFERENCES":
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value,
        },
      };

    default:
      return state;
  }
}

const fetchApi = async (url, dispatch) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    dispatch({
      type: "FETCH_FAILURE",
      payload: "Erreur lors de la récupération des données",
    });
    console.error(`Error fetching from ${url}:`, error);
    return null;
  }
};

const EditProfile = () => {
  const { userConnected, userPreferences, setUserPreferences } =
    useContext(GlobalContext);

  const [state, dispatch] = useReducer(reducer, initialState);
  let { formData, error, isLoading } = state;

  useEffect(() => {
    const fetchUserData = async () => {
      dispatch({ type: "START_FETCH" });
      const userData = await getUserConnected();
      if (userData.id) {
        dispatch({ type: "FETCH_SUCCESS", payload: userData });
        const departmentData = await fetchApi(
          `/api/departments/getDepartment/${userData.teamId}`,
          dispatch,
        );
        const teamData = await fetchApi(
          `/api/teams/getTeamById/${userData.teamId}`,
          dispatch,
        );

        formData.team = teamData;
        const countriesData = await fetchApi("/api/countries", dispatch);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            userId: userData.id,
            department: departmentData.name,
            team: teamData.name,
            countries: countriesData,
          },
        });

        // // Récupérer les préférences utilisateur
        // const userPreferences = await fetchApi(
        //   `/api/userPreferences/${userData.id}`,
        //   dispatch,
        // );
        // if (userPreferences) {
        //   console.log("USER PREFERENCES In ProfilePage ;;;; ", userPreferences);
        //   dispatch({
        //     type: "UPDATE_USER_PREFERENCES",
        //     payload: {
        //       countryId: userPreferences.countryId,
        //       cityId: userPreferences.cityId,
        //       officeId: userPreferences.officeId,
        //       zoneId: userPreferences.zoneId,
        //       reservationTypeId: userPreferences.reservationTypeId,
        //       workAreaId: userPreferences.workAreaId,
        //       equipmentIds: userPreferences.equipmentIds,
        //       screenId: userPreferences.screenId,
        //       furnitureIds: userPreferences.furnitureIds,
        //     },
        //   });
        // }
        // setUserPreferences(userPreferences);
      } else {
        dispatch({
          type: "FETCH_FAILURE",
          payload: "Impossible de récupérer les données de l'utilisateur",
        });
      }
    };

    fetchUserData();
  }, [userConnected, setUserPreferences]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch({ type: "UPDATE_FIELD", field: name, value: value });

    if (name === "countryId" || name === "cityId" || name === "officeId") {
      updateLocationInfoForm(name, value);
    }
  };

  async function updateLocationInfoForm(name, value) {
    if (!value) return;

    let updatedData = {};
    if (name === "countryId") {
      const citiesData = await fetchApi(
        `/api/cities/getCities/${value}`,
        dispatch,
      );
      updatedData = {
        cities: citiesData || [],
        cityId: "",
        officeId: "",
        zones: [],
      };
    } else if (name === "cityId") {
      const officesData = await fetchApi(
        `/api/offices/getOffices/${value}`,
        dispatch,
      );
      updatedData = { offices: officesData || [], officeId: "", zones: [] };
    } else if (name === "officeId") {
      const zonesData = await fetchApi(
        `/api/zones/getZones/${value}`,
        dispatch,
      );
      updatedData = { zones: zonesData || [] };
    }

    dispatch({ type: "UPDATE_LOCATIONS", payload: updatedData });
  }

  // Récupérer les préférences utilisateur

  useEffect(() => {
    const fetchBookingPreferencesData = async () => {
      dispatch({ type: "START_FETCH" });

      const reservationTypeData = await fetchApi(
        "/api/reservationTypes",
        dispatch,
      );
      const workAreaData = await fetchApi("/api/workAreas", dispatch);
      const equipmentData = await fetchApi("/api/equipments", dispatch);
      const screenData = await fetchApi("/api/screens", dispatch);
      const furnitureData = await fetchApi("/api/furnitures", dispatch);

      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          reservationTypes: reservationTypeData || [],
          workAreas: workAreaData || [],
          equipments: equipmentData || [],
          screens: screenData || [],
          furnitures: furnitureData || [],
        },
      });
    };

    fetchBookingPreferencesData();
  }, []);
  const updateBookingPreferences = (name, value) => {
    dispatch({ type: "UPDATE_BOOKING_PREFERENCES", field: name, value: value });
  };

  // Fonction pour sélectionner les données nécessaires
  const getPreferencesData = (formData) => {
    return {
      userId: formData.userId,
      countryId: formData.countryId,
      cityId: formData.cityId,
      officeId: formData.officeId,
      zoneId: formData.zoneId,
      reservationTypeId: formData.reservationTypeId,
      workAreaId: formData.workAreaId,
      equipmentIds: formData.equipmentIds,
      screenId: formData.screenId,
      furnitureIds: formData.furnitureIds,
    };
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    dispatch({ type: "START_FETCH" });
    const preferencesData = getPreferencesData(formData);
    try {
      await axios.post(`/api/userPreferences/addPreferences`, preferencesData);
      //setUserConnected(response.data);
      setUserPreferences(preferencesData);
      dispatch({ type: "FETCH_SUCCESS" });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      dispatch({
        type: "FETCH_FAILURE",
        payload: "Une erreur est survenue lors de la mise à jour du profil.",
      });
    }
  };

  if (!userConnected) {
    return <div>User not found</div>;
  }

  return (
    <div className="main">
      <h2>Edit profile</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={onSubmit}>
        <div className="accordion" id="accordionExample">
          <PersonalInfo formData={formData} handleChange={handleChange} />
          <LocationInfo
            formData={formData}
            userPreferences={userPreferences}
            handleChange={handleChange}
          />
          <BookingPreferences
            formData={state.formData}
            userPreferences={userPreferences}
            updateBookingPreferences={updateBookingPreferences}
          />
        </div>
        <br />
        <div>
          <button type="submit" className="btn btn-primary">
            Save preferences
          </button>

          <span className="link-space">
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;
          </span>

          {/*<button*/}
          {/*  type="submit"*/}
          {/*  className="btn btn-primary"*/}
          {/*  onClick={() => setUserPreferences([])}*/}
          {/*>*/}
          {/*  Edit preferences*/}
          {/*</button>*/}
        </div>
      </form>
    </div>
  );
};

export default function ProfilePage() {
  return <EditProfile />;
}
