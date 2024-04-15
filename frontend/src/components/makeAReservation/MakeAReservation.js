import SearchWorkStation from "../searchWorkStation/SearchWorkStation";
import "./MakeAReservation.scss";
import React, { useState } from "react";
import AvailableWorkStations from "../availableWorkStations/AvailableWorkStations";

export default function MakeAReservation() {
  const [formSent, setFormSent] = useState(false);
  const handleFormSend = () => {
    setFormSent(true); // Cette fonction sera appelée pour indiquer que le formulaire a été envoyé
  };
  return (
    <div>
      <div className="principal">
        <div className="search-workStation">
          <SearchWorkStation onFormSend={handleFormSend}></SearchWorkStation>
        </div>
        <div className="result">
          <AvailableWorkStations formSent={formSent}></AvailableWorkStations>
        </div>
      </div>
    </div>
  );
}
