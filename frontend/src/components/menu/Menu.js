import "./Menu.scss";
import { useEffect } from "react";

export default function Menu({ userConnected }) {
  useEffect(() => {
    console.log("Menu is mounted");
    console.log("USER CONNECTED in Menu: ", userConnected);
  }, [userConnected]);
  return (
    <div className="fixed-menu">
      <nav className="nav flex-column">
        <div>HELLOOOOO {userConnected}!!!!!!!</div>
        <a className="nav-link active" aria-current="page" href="#">
          Dashboard
        </a>
        <a className="nav-link" href="#">
          Current reservations
        </a>
        <a
          className="nav-link"
          href="/addReservation"
          userConnected={userConnected}
        >
          New reservation
        </a>
        <a className="nav-link" href="#">
          Find a colleague
        </a>
      </nav>
    </div>
  );
}
