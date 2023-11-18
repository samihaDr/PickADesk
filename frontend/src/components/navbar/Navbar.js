import logo from "../../assets/images/logo.png";
import React, { useEffect } from "react";
import "./Navbar.scss";
import Logout from "../logout/Logout";

export default function Navbar({ userConnected }) {
  useEffect(() => {
    console.log("Navbar is mounted");
    console.log("USER CONNECTED in Navbar: ", userConnected);
  }, [userConnected]);

  console.log("Navbar is rendered");
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img
            src={logo}
            alt="Logo"
            width="80"
            height="60"
            className="d-inline-block align-text-top"
          />
        </a>
        <span className="nav-item">
          <div style={{ fontWeight: "bold", color: "#1f4e5f" }}>
            Welcome, {userConnected}
          </div>
        </span>
        <ul className="nav justify-content-end">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="/">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Profile
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/">
              <Logout /> Logout
            </a>
            {/*<button variant="secondary">Logout</button>*/}
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
