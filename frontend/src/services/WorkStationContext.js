import React, { createContext, useState } from "react";

export const WorkStationContext = createContext();

export const WorkStationProvider = ({ children }) => {
  const [workStations, setWorkStations] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({
    date: new Date(), // une date par défaut
    timePeriod: { morning: false, afternoon: false }, // valeurs par défaut
    zone: "",
    reservationType: "",
    workArea: "",
    // screen: "",
    // equipment: [],
    // furniture: [],
  });

  return (
    <WorkStationContext.Provider
      value={{
        workStations,
        setWorkStations,
        selectedOptions,
        setSelectedOptions,
      }}
    >
      {children}
    </WorkStationContext.Provider>
  );
};
