import React from "react";
import logo from "../../assets/images/logo.png";
import "./Home.scss";

export default function Home() {
  return (
    <div>
      <card className="card">
        <h2>Welcome</h2>
        <div className="home-container">
          <div className="card-body">
            <div className="card-img">
              <img src={logo} alt="Logo" width="300" height="250" />
            </div>
            <p className="card-text">Book easily. Work efficiently</p>
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
