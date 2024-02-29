import React, { createContext, useEffect, useReducer } from "react";

const AUTH_TOKEN_KEY = "jhi-authenticationToken";

// Initialiser l'état global
const initialState = {
  userConnected: null,
  userInfo: null,
  userPreferences: null,
  weeklyQuota: null,
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
    case "SET_AUTHENTICATED":
      return {
        ...state,
        isAuthenticated: !!action.payload,
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
        setUserPreferences,
        setIsAuthenticated,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
