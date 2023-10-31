import React from "react";
import logo from "../../assets/images/logo.png";
import "./Home.scss";

export default function Home() {
  return (
    <div>
      <card className="card">
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
              <a href="/LoginPage" className="card-link">
                Login
              </a>
              <a href="/RegisterPage" className="card-link">
                Register
              </a>
            </div>
          </div>
        </div>
      </card>
    </div>
  );
}
