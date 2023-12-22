import React, { createContext, useReducer } from "react";

// Initialiser l'état global
const initialState = {
  userConnected: null,
  weeklyQuota: null,
};

export const GlobalContext = createContext(initialState);

// Reducer pour gérer les changements d'état
const globalReducer = (state, action) => {
  console.log("Action dispatched:", action);
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        userConnected: action.payload,
      };
    case "SET_QUOTA":
      return {
        ...state,
        weeklyQuota: action.payload,
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
    dispatch({ type: "SET_USER", payload: user });
  };

  const setWeeklyQuota = (quota) => {
    dispatch({ type: "SET_QUOTA", payload: quota });
  };

  return (
    <GlobalContext.Provider
      value={{ ...state, setUserConnected, setWeeklyQuota }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
