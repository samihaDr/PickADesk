import React, { createContext, useEffect, useReducer } from "react";

const AUTH_TOKEN_KEY = "jhi-authenticationToken";

// Initialiser l'état global
const initialState = {
  userConnected: null,
  userInfo: null,
  userPreferences: null,
  weeklyQuota: null,
  weeklyRemaining: 2.5,
  reservations: [],
  isAuthenticated: !!sessionStorage.getItem(AUTH_TOKEN_KEY),
};

export const GlobalContext = createContext(initialState);

// Reducer pour gérer les changements d'état
const globalReducer = (state, action) => {
  console.log("Action dispatched:", action);
  switch (action.type) {
    case "SET_USER_CONNECTED":
      return {
        ...state,
        userConnected: action.payload,
      };
    case "SET_USER_INFO":
      return {
        ...state,
        userInfo: action.payload,
        isAuthenticated: !!action.payload, // isAuthenticated est vrai si payload n'est pas null
      };
    case "SET_USER_PREFERENCES":
      return {
        ...state,
        userPreferences: action.payload,
      };
    case "SET_QUOTA":
      return {
        ...state,
        weeklyQuota: action.payload,
      };
    case "SET_REMAINING":
      return {
        ...state,
        weeklyRemaining: action.payload,
      };
    case "SET_AUTHENTICATED":
      return {
        ...state,
        isAuthenticated: !!action.payload,
      };
    case "SET_RESERVATIONS":
      return {
        ...state,
        reservations: action.payload,
      };
    case "DELETE_RESERVATION":
      return {
        ...state,
        reservations: state.reservations.filter(
          (reservation) => reservation.id !== action.payload,
        ),
      };
    default:
      return state;
  }
};

// Composant Provider pour englober l'application
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  // Actions pour modifier l'état
  const setUserConnected = (user) => {
    dispatch({ type: "SET_USER_CONNECTED", payload: user });
  };
  const setUserInfo = (user) => {
    sessionStorage.setItem("userInfo", JSON.stringify(user)); // Persister l'utilisateur connecté dans localStorage
    dispatch({ type: "SET_USER_INFO", payload: user });
  };
  const setUserPreferences = (userPreferences) => {
    sessionStorage.setItem("userPreferences", JSON.stringify(userPreferences));
    dispatch({
      type: "SET_USER_PREFERENCES",
      payload: userPreferences,
    });
  };
  const setWeeklyQuota = (quota) => {
    sessionStorage.setItem("weeklyQuota", JSON.stringify(quota));
    dispatch({ type: "SET_QUOTA", payload: quota });
  };
  const setWeeklyRemaining = (remaining) => {
    sessionStorage.setItem("weeklyRemaining", JSON.stringify(remaining));
    dispatch({ type: "SET_REMAINING", payload: remaining });
  };
  const setIsAuthenticated = (isAuthenticated) => {
    dispatch({ type: "SET_AUTHENTICATED", payload: isAuthenticated });
    // Mise à jour du stockage du navigateur pour refléter l'état d'authentification
    if (isAuthenticated) {
      sessionStorage.setItem("isAuthenticated", isAuthenticated);
    } else {
      // En cas de déconnexion, supprimez le jeton du stockage
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
    }
  };

  const setReservations = (reservations) => {
    dispatch({ type: "SET_RESERVATIONS", payload: reservations });
  };

  const deleteReservation = (reservationId) => {
    dispatch({ type: "DELETE_RESERVATION", payload: reservationId });
  };
  // Restaurer l'état de connexion de l'utilisateur au démarrage de l'application
  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem("userInfo");
    if (storedUserInfo) {
      const user = JSON.parse(storedUserInfo);
      dispatch({ type: "SET_USER_INFO", payload: user });
    }
    const storedUserPreferences = sessionStorage.getItem("userPreferences");
    if (storedUserPreferences) {
      const userPreferences = JSON.parse(storedUserPreferences);
      dispatch({ type: "SET_USER_PREFERENCES", payload: userPreferences });
    }
    const storedQuota = sessionStorage.getItem("weeklyQuota");
    if (storedQuota) {
      const quota = JSON.parse(storedQuota);
      dispatch({ type: "SET_QUOTA", payload: quota });
    }
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        ...state,
        setUserConnected,
        setUserInfo,
        setWeeklyQuota,
        setWeeklyRemaining,
        setUserPreferences,
        setIsAuthenticated,
        setReservations,
        deleteReservation,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
