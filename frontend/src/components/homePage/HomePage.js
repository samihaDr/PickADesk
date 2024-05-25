import React from "react";
import logo from "../../assets/images/logo.png";
import "./HomePage.scss";
import {Link} from "react-router-dom";

export default function HomePage() {
  return (
    <div className="main">
      <h2> Welcome</h2>
      <div className="home-container">
        <div className="card-body">
          <div className="card-img">
            <img src={logo} alt="Logo" width="300" height="250" />
          </div>
          <h3 className="card-text">Book easily. Work efficiently</h3>
          <div className="card-links">
            <Link to="/loginPage" className="link">Login</Link>
            {/*/!* Ajout d'un espace entre les liens *!/*/}
            {/*<span className="link-space">*/}
            {/*  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;*/}
            {/*</span>*/}
            {/*<a href="/RegisterPage" className="link">*/}
            {/*  Register*/}
            {/*</a>*/}
          </div>
        </div>
      </div>
    </div>
  );
}
