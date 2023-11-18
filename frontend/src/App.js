import React, { useEffect, useState } from "react";
import LoginPage from "./components/loginPage/LoginPage.js";
import { Route, Routes } from "react-router-dom";
import AddReservation from "./components/reservation/AddReservation";
import RegisterPage from "./components/registerPage/RegisterPage";
import Home from "./components/home/Home";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import Navbar from "./components/navbar/Navbar";
import axios from "axios";
import Dashboard from "./components/dashboard/Dashboard";

export const AUTH_TOKEN_KEY = "jhi-authenticationToken";
export default function App() {
  const [userConnected, setUserConnected] = useState("");
  useEffect(() => {
    axios.interceptors.request.use(
      function (request) {
        const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          request.headers.Authorization = `Bearer ${token}`;
          console.log("userConnected in App: ", userConnected);
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
      {userConnected && (
        <Navbar
          userConnected={userConnected}
          setUserConnected={setUserConnected}
        />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="addReservation" element={<AddReservation />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route
          path="registerPage"
          element={<RegisterPage setUserConnected={setUserConnected} />}
        />
        <Route
          path="loginPage"
          element={<LoginPage setUserConnected={setUserConnected} />}
        />
      </Routes>
    </div>
  );
}
