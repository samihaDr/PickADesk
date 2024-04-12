import SearchWorkStation from "../searchWorkStation/SearchWorkStation";
import "./MakeAReservation.scss";
import React from "react";
import AvailableWorkStations from "../availableWorkStations/AvailableWorkStations";

export default function MakeAReservation() {
  return (
    <div>
      <h2>Make a reservation</h2>
      <div className="principal">
        <div className="search-workStation">
          <SearchWorkStation></SearchWorkStation>
        </div>
        <div className="result">
          <AvailableWorkStations></AvailableWorkStations>
          {/*<SelectFavorite></SelectFavorite>*/}
        </div>
      </div>
    </div>
  );
}
