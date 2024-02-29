import logo from "../../assets/images/logo1.png";
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
    isAuthenticated,
    userInfo,
    setUserInfo,
    setUserPreferences,
  } = useContext(GlobalContext);

  useEffect(() => {
    if (!isAuthenticated) {
      return null;
    }
  }, [userConnected, weeklyQuota, isAuthenticated, userInfo]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
      <div className="container-fluid">
        <div className="welcome">
          <a className="navbar-brand" href="/">
            <img
              src={logo}
              alt="Logo"
              className="d-inline-block align-text-top"
            />
          </a>
          <span className="userInfo">
            {userInfo && (
              <div>
                <span>
                  Welcome, {userInfo.firstname + " " + userInfo.lastname}
                </span>
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
              setUserInfo={setUserInfo}
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
