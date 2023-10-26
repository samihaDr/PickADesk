import React from "react";
import LoginPage from "./components/loginPage/LoginPage.js";
import { Route, Routes } from "react-router-dom";
import AddReservation from "./components/reservation/AddReservation";
import RegisterPage from "./components/registerPage/RegisterPage";
import Home from "./components/home/Home";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import Navbar from "./components/navbar/Navbar";
function App() {
  return (
    <div>
      <div>
        <Navbar />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="addReservation" element={<AddReservation />} />
        <Route path="registerPage" element={<RegisterPage />} />
        <Route path="loginPage" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
