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
    });
    const [isGroupBooking, setIsGroupBooking] = useState(false);
    const [teamMembers, setTeamMembers ] = useState([]);
    const [selectedStations, setSelectedStations ] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [isColleagueBooking, setColleagueBooking] = useState(false);
    const [selectedColleague, setSelectedColleague] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    return (
        <WorkStationContext.Provider
            value={{
                workStations, setWorkStations,
                selectedOptions, setSelectedOptions,
                isGroupBooking, setIsGroupBooking,
                teamMembers, setTeamMembers,
                selectedStations, setSelectedStations,
                selectedMembers, setSelectedMembers,
                isColleagueBooking, setColleagueBooking,
                selectedColleague, setSelectedColleague,
                totalPages, setTotalPages,
                currentPage, setCurrentPage
            }}
        >
            {children}
        </WorkStationContext.Provider>
    );
};