import logo from "../../assets/images/logo.png";
import React, { useContext, useEffect } from "react";
import "./Navbar.scss";
import LogoutButton from "../logout/Logout";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../services/GlobalState";

export default function Navbar() {
  const {
    userConnected,
    weeklyQuota,
    userPreferences,
    setUserConnected,
    setUserPreferences,
  } = useContext(GlobalContext);

  useEffect(() => {
    console.log("USER CONNECTED in Navbar: ", userConnected);
    console.log("Weekly quota in Navbar :", weeklyQuota);
  }, [userConnected, weeklyQuota]);
  if (!userConnected) {
    return null; // Ne rien rendre si l'utilisateur n'est pas connecté
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <div className="welcome">
          <a className="navbar-brand" href="/">
            <img
              src={logo}
              alt="Logo"
              width="80"
              height="60"
              className="d-inline-block align-text-top"
            />
          </a>
          <span className="userInfo">
            {userConnected && (
              <div style={{ fontWeight: "bold", color: "#1f4e5f" }}>
                <p>Welcome, {userConnected}</p>
              </div>
            )}
          </span>
        </div>

        <div className="quotaInfo">
          <span className="weeklyQuota">
            {<div> Quota : {weeklyQuota}</div>}
          </span>
          <span className="remaining">
            {<div> Remaining : {weeklyQuota}</div>}
          </span>
        </div>

        <ul className="nav justify-content-end">
          <li className="nav-item">
            <Link
              to="/dashboard"
              className="nav-link active"
              aria-current="page"
            >
              Home
            </Link>
          </li>

          <li className="nav-item">
            <Link
              to="/profilePage"
              className="nav-link active"
              aria-current="page"
              userPreferences={userPreferences}
              setUserPreferences={setUserPreferences}
            >
              Profile
            </Link>
          </li>

          <li className="nav-item">
            <LogoutButton
              setUserConnected={setUserConnected}
              setUserPreferences={setUserPreferences}
            />
          </li>
        </ul>
        {/*<form className="d-flex" role="search">*/}
        {/*    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>*/}
        {/*        <button className="btn btn-outline-success" type="submit">Search</button>*/}
        {/*</form>*/}
      </div>
    </nav>
  );
}
