import React from "react";
import logo from "../../assets/images/logo.png";
import "./Home.scss";

export default function Home() {
  return (
    <div className="main">
      <h2 style={{ color: "#1f4e5f" }}> Welcome</h2>
      <div className="home-container">
        <div className="card-body">
          <div className="card-img">
            <img src={logo} alt="Logo" width="300" height="250" />
          </div>
          <h3 className="card-text" style={{ color: "#1f4e5f" }}>
            Book easily. Work efficiently
          </h3>
          <div className="card-links">
            <a href="/LoginPage" className="link">
              Login
            </a>
            {/* Ajout d'un espace entre les liens */}
            <span className="link-space">
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            </span>
            <a href="/RegisterPage" className="link">
              Register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
