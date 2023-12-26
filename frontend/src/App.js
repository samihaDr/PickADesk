import React, { useEffect } from "react";
import { GlobalProvider } from "./services/GlobalState";
import LoginPage from "./components/loginPage/LoginPage.js";
import { Route, Routes } from "react-router-dom";
import AddReservation from "./components/reservation/AddReservation";
import RegisterPage from "./components/registerPage/RegisterPage";
import Home from "./components/home/Home";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import axios from "axios";
import Dashboard from "./components/dashboard/Dashboard";
import Layout from "./Layout";
import ProfilePage from "./components/profilePage/ProfilePage";
import ChangePassword from "./components/changePassword/ChangePassword";

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
      <Layout />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="addReservation" element={<AddReservation />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="changePassword" element={<ChangePassword />} />
        <Route path="registerPage" element={<RegisterPage />} />
        <Route path="profilePage" element={<ProfilePage />} />
        <Route path="loginPage" element={<LoginPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </GlobalProvider>
  );
}
