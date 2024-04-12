import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import { GlobalContext, GlobalProvider } from "./services/GlobalState";
import LoginPage from "./components/loginPage/LoginPage.js";
import AddReservation from "./components/reservation/ReservationDetails";
import RegisterPage from "./components/registerPage/RegisterPage";
import Home from "./components/home/Home";
import Dashboard from "./components/dashboard/Dashboard";
import Layout from "./Layout";
import ProfilePage from "./components/profilePage/ProfilePage";
import ChangePassword from "./components/changePassword/ChangePassword";
import SearchWorkStation from "./components/searchWorkStation/SearchWorkStation";
import AvailableWorkStations from "./components/availableWorkStations/AvailableWorkStations";
import { WorkStationProvider } from "./services/WorkStationContext";
import "./App.css";

import "bootstrap/dist/css/bootstrap-grid.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import axios from "axios";
import ReservationDetails from "./components/reservation/ReservationDetails";
import MyReservations from "./components/myReservations/MyReservations";
import FindColleague from "./components/findColleague/FindColleague";
import MakeAReservation from "./components/makeAReservation/MakeAReservation";

export const AUTH_TOKEN_KEY = "jhi-authenticationToken";
const UserConnected = () => {
  const history = useNavigate();
  const { isAuthenticated, userInfo, setUserInfo } = useContext(GlobalContext);

  useEffect(() => {
    console.log("UserInfo in App  :", userInfo);
    if (!isAuthenticated) {
      history("/loginPage");
    }
  }, [history, isAuthenticated]);

  return (
    <>{userInfo && <Layout userInfo={userInfo} setUserInfo={setUserInfo} />}</>
  );
};
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
        <UserConnected />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="addReservation" element={<AddReservation />} />
          <Route path="searchWorkStation" element={<SearchWorkStation />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="changePassword" element={<ChangePassword />} />
          <Route path="registerPage" element={<RegisterPage />} />
          <Route path="profilePage" element={<ProfilePage />} />
          <Route path="myReservations" element={<MyReservations />} />
          <Route path="loginPage" element={<LoginPage />} />
          <Route path="findColleague" element={<FindColleague />} />
          <Route path="makeAReservation" element={<MakeAReservation />} />
          <Route path="*" element={<LoginPage />} />
          <Route
            path="availableWorkStations"
            element={<AvailableWorkStations />}
          />
          <Route path="reservationDetails" element={<ReservationDetails />} />
        </Routes>
      </WorkStationProvider>
    </GlobalProvider>
  );
}
