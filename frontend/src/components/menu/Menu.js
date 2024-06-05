import React, { useContext, useEffect } from "react";
import { GlobalContext } from "../../services/GlobalState";
import { Link } from "react-router-dom";
import "./Menu.scss";

export default function Menu() {
  const { userInfo,isAuthenticated } = useContext(GlobalContext);
  useEffect(() => {
    if (!userInfo || !isAuthenticated) {
      return null;
    }
  }, [isAuthenticated, userInfo]);

  return (
    <div className="fixed-menu">
      <nav className="nav flex-column">
        <h5>My space</h5>
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
          to="/makeAReservation"
          className="nav-link active"
          aria-current="page"
        >
          Make a reservation
        </Link>
        <Link
          to="/findColleague"
          className="nav-link active"
          aria-current="page"
        >
          Find a colleague
        </Link>
        <br />
        <h5>My team</h5>
        <Link
          to="/teamSettings"
          className="nav-link active"
          aria-current="page"
        >
          Team settings
        </Link>
        {userInfo && userInfo.role === 'MANAGER' && (
            <Link
                to="/editMemberParameters"
                className="nav-link active"
                aria-current="page"
            >
              Edit member quotas
            </Link>
        )}
        {userInfo && userInfo.role === 'MANAGER' && (
            <Link
                to="/editTeamParameters"
                className="nav-link active"
                aria-current="page"
            >
              Edit team quotas
            </Link>
        )}
      </nav>
    </div>
  );
}
