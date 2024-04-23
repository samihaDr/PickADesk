import logo from "../../assets/images/logo1.png";
import React, { useCallback, useContext, useEffect, useState } from "react";
import "./Navbar.scss";
import LogoutButton from "../logout/Logout";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../services/GlobalState";
import useCalculateRemaining from "../hooks/useCalculateRemaining";

export default function Navbar() {
  const {
    userConnected,
    weeklyRemaining,
    userPreferences,
    isAuthenticated,
    userInfo,
    setUserInfo,
    setUserPreferences,
  } = useContext(GlobalContext);

  const [favorites, setFavorites] = useState([]);
  const calculateRemaining = useCallback(useCalculateRemaining(), []);
  useEffect(() => {
    // Charger les favoris du localStorage au montage du composant
    const loadedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(loadedFavorites);
  }, []);

  useEffect(() => {
    if (isAuthenticated && userInfo?.id) {
      calculateRemaining(userInfo.id);
    }
  }, [calculateRemaining, isAuthenticated, userInfo?.id]);

  useEffect(() => {
    if (!isAuthenticated) {
      return null;
    }
  }, [userConnected, isAuthenticated, userInfo]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
      <div className="container-fluid">
        <div className="welcome">
          <a className="navbar-brand" href="">
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
            {<div> Quota : {userInfo.memberQuota} / week</div>}
          </span>
          <span className="remaining">
            <div className="remaining">
              <div>
                {" "}
                Remaining :
                <strong className={weeklyRemaining <= 0 ? "negative" : ""}>
                  {" "}
                  {weeklyRemaining}{" "}
                </strong>
              </div>
            </div>
          </span>
        </div>

        <ul className="nav justify-content-end">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Favorites <i className="fas fa-star"></i>
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
              {favorites.map((favorite, index) => (
                <li key={index}>
                  <a className="dropdown-item" href="#">
                    {favorite.workPlace}
                  </a>
                </li>
              ))}
            </ul>
          </li>
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
