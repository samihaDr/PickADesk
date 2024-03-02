import React, { useContext, useEffect } from "react";
import { GlobalContext } from "../../services/GlobalState";
import { Link } from "react-router-dom";
import "./Menu.scss";

export default function Menu() {
  const { isAuthenticated } = useContext(GlobalContext);
  useEffect(() => {
    if (!isAuthenticated) {
      return null;
    }
  }, [isAuthenticated]);

  return (
    <div className="fixed-menu">
      <nav className="nav flex-column">
        <span>Your space</span>
        <br />

        <Link to="/dashboard" className="nav-link active" aria-current="page">
          Dashboard
        </Link>
        <Link
          to="/myReservations"
          className="nav-link active"
          aria-current="page"
        >
          My reservations
        </Link>
        <Link
          to="/searchWorkStation"
          className="nav-link active"
          aria-current="page"
        >
          Make a reservation
        </Link>
        <Link to="/" className="nav-link active" aria-current="page">
          Find colleague
        </Link>
      </nav>
    </div>
  );
}
