import logo from "../../assets/images/logo.png";
import React from "react";
import "./Navbar.scss";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img
            src={logo}
            alt="Logo"
            width="70"
            height="55"
            className="d-inline-block align-text-top"
          />
        </a>
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
            <a className="nav-link" href="#">
              Log out
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled" aria-disabled="true">
              Disabled
            </a>
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
