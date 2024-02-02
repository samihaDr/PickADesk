import React, { useContext } from "react";
import { GlobalContext } from "../../services/GlobalState";
import { Link } from "react-router-dom";
import "./Menu.scss";

export default function Menu() {
  const { userConnected } = useContext(GlobalContext);

  if (!userConnected) {
    return null; // Ne rien rendre si l'utilisateur n'est pas connecté
  }

  return (
    <div className="fixed-menu">
      <nav className="nav flex-column">
        <span>Your space</span>
        <br />

        <Link to="/dashboard" className="nav-link active" aria-current="page">
          Dashboard
        </Link>
        <Link
          to="/currentReservation"
          className="nav-link active"
          aria-current="page"
        >
          Current reservations
        </Link>
        <Link
          to="/searchWorkStation"
          className="nav-link active"
          aria-current="page"
        >
          Make a reservation
        </Link>
        <Link to="/" className="nav-link active" aria-current="page">
          Find Colleague
        </Link>
      </nav>
    </div>
  );
}
