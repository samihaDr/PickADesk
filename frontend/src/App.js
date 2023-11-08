import React, { useEffect } from "react";
import LoginPage from "./components/loginPage/LoginPage.js";
import { Route, Routes } from "react-router-dom";
import AddReservation from "./components/reservation/AddReservation";
import RegisterPage from "./components/registerPage/RegisterPage";
import Home from "./components/home/Home";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import Navbar from "./components/navbar/Navbar";
import axios from "axios";

export const AUTH_TOKEN_KEY = "jhi-authenticationToken";
export default function App() {
  useEffect(() => {
    axios.interceptors.request.use(
      function (request) {
        const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          request.headers.Authorization = `Bearer ${token}`;
        }
        return request;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  });

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
