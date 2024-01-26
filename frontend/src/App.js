import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import { GlobalProvider } from "./services/GlobalState";
import LoginPage from "./components/loginPage/LoginPage.js";
import AddReservation from "./components/reservation/AddReservation";
import RegisterPage from "./components/registerPage/RegisterPage";
import Home from "./components/home/Home";
import Dashboard from "./components/dashboard/Dashboard";
import Layout from "./Layout";
import ProfilePage from "./components/profilePage/ProfilePage";
import ChangePassword from "./components/changePassword/ChangePassword";
import SearchWorkStation from "./components/searchWorkStation/SearchWorkStation";
import AvailableWorkStations from "./components/availableWorkStations/AvailableWorkStations";
import { WorkStationProvider } from "./services/WorkStationContext";

import "bootstrap/dist/css/bootstrap-grid.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
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
    <GlobalProvider>
      <WorkStationProvider>
        {" "}
        <Layout />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="addReservation" element={<AddReservation />} />
          <Route path="searchWorkStation" element={<SearchWorkStation />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="changePassword" element={<ChangePassword />} />
          <Route path="registerPage" element={<RegisterPage />} />
          <Route path="profilePage" element={<ProfilePage />} />
          <Route path="loginPage" element={<LoginPage />} />
          <Route path="*" element={<LoginPage />} />
          <Route
            path="availableWorkStations"
            element={<AvailableWorkStations />}
          />
        </Routes>
      </WorkStationProvider>
    </GlobalProvider>
  );
}
