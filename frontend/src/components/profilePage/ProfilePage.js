import React, { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { GlobalContext } from "../../services/GlobalState";
import { getUserConnected } from "../../services/getUserConnected";
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
    default:
      return state;
  }
}

const fetchApi = async (url, dispatch) => {
  try {
    const response = await axios.get(url);
    console.log(`9999999  Data from ${url}:`, response.data); // Ajout pour le débogage
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
  const { userConnected, setUserConnected } = useContext(GlobalContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { formData, error, isLoading } = state;

  useEffect(() => {
    const fetchUserData = async () => {
      dispatch({ type: "START_FETCH" });
      const userData = await getUserConnected();
      console.log("User Data:", userData);
      if (userData) {
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
        console.log("FormDATA //// Team", formData.team);
        const countriesData = await fetchApi("/api/countries", dispatch);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            department: departmentData.name,
            team: teamData.name,
            countries: countriesData,
          },
        });
        formData.department = departmentData;

        formData.countries = countriesData;
      } else {
        dispatch({
          type: "FETCH_FAILURE",
          payload: "Impossible de récupérer les données de l'utilisateur",
        });
      }
    };

    fetchUserData();
  }, [userConnected.id]); // Ajout de userConnected.id comme dépendance

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch({ type: "UPDATE_FIELD", field: name, value: value });

    if (name === "countryId" || name === "cityId" || name === "officeId") {
      updateLocationInfoForm(name, value);
    }
  };

  async function updateLocationInfoForm(name, value) {
    if (!value) return; // Ajout d'une vérification pour s'assurer que la valeur n'est pas vide

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

  const updatePreference = (value) => {
    // ... La logique pour mettre à jour les préférences ...
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    dispatch({ type: "START_FETCH" });

    try {
      const response = await axios.put(
        `/api/users/editProfile/${userConnected.id}`,
        formData,
      );
      setUserConnected(response.data);
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
      <div className="accordion" id="accordionExample">
        <PersonalInfo formData={formData} handleChange={handleChange} />
        <LocationInfo formData={formData} handleChange={handleChange} />
        <BookingPreferences
          formData={formData}
          updatePreference={updatePreference}
        />
      </div>
      <br />
      <div>
        <button type="submit" className="btn btn-primary">
          Save preferences
        </button>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  return <EditProfile />;
}
