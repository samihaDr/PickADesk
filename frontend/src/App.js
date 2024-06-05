import React, {useContext, useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import {GlobalContext, GlobalProvider} from "./services/GlobalState";
import LoginPage from "./components/loginPage/LoginPage.js";
import AddReservation from "./components/reservation/ReservationDetails";
import ReservationDetails from "./components/reservation/ReservationDetails";
import RegisterPage from "./components/registerPage/RegisterPage";
import HomePage from "./components/homePage/HomePage";
import Dashboard from "./components/dashboard/Dashboard";
import Layout from "./Layout";
import ProfilePage from "./components/profilePage/ProfilePage";
import ChangePassword from "./components/changePassword/ChangePassword";
import SearchWorkStation from "./components/searchWorkStation/SearchWorkStation";
import AvailableWorkStations from "./components/availableWorkStations/AvailableWorkStations";
import {WorkStationProvider} from "./services/WorkStationContext";
import MyReservations from "./components/myReservations/MyReservations";
import FindColleague from "./components/findColleague/FindColleague";
import MakeAReservation from "./components/makeAReservation/MakeAReservation";
import OfficeMap from "./components/officeMap/OfficeMap";
import TeamSettings from "./components/myTeam/TeamSettings";
import EditMemberParameters from "./components/editParameters/EditMemberParameters";
import EditTeamParameters from "./components/editParameters/EditTeamParameters";
import "./App.css";
import "./index.css";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import {ToastContainer} from 'react-toastify';

export const AUTH_TOKEN_KEY = "jhi-authenticationToken";

const UserConnected = () => {

    const {userInfo} = useContext(GlobalContext);

    // conditioned access to  EditMemberParameters component
    const editMemberParametersRoute = userInfo?.role === 'MANAGER' ? (
        <Route path="editMemberParameters" element={<EditMemberParameters/>}/>
    ) : null;

    // conditioned access to  EditTeamParameters component
    const editTeamParametersRoute = userInfo?.role === 'MANAGER' ? (
        <Route path="editTeamParameters" element={<EditTeamParameters/>}/>
    ) : null;
    return (
        <>
            {userInfo && <Layout userInfo={userInfo}/>}
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="addReservation" element={<AddReservation/>}/>
                <Route path="searchWorkStation" element={<SearchWorkStation/>}/>
                <Route path="dashboard" element={<Dashboard/>}/>
                <Route path="changePassword" element={<ChangePassword/>}/>
                <Route path="registerPage" element={<RegisterPage/>}/>
                <Route path="profilePage" element={<ProfilePage/>}/>
                <Route path="myReservations" element={<MyReservations/>}/>
                <Route path="loginPage" element={<LoginPage/>}/>
                <Route path="findColleague" element={<FindColleague/>}/>
                <Route path="makeAReservation" element={<MakeAReservation/>}/>
                <Route path="officeMap" element={<OfficeMap/>}/>
                <Route path="teamSettings" element={<TeamSettings/>}/>
                <Route path="availableWorkStations" element={<AvailableWorkStations/>}/>
                <Route path="reservationDetails" element={<ReservationDetails/>}/>
                {editMemberParametersRoute}
                {editTeamParametersRoute}
                <Route path="*" element={<HomePage/>}/>
            </Routes>
            <ToastContainer/>
        </>
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
            }
        );
    });

    return (
        <GlobalProvider>
            <WorkStationProvider>
                <UserConnected/>
            </WorkStationProvider>
        </GlobalProvider>
    );
}
