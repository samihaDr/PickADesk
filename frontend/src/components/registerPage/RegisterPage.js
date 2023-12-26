import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegisterPage.scss";
import { AUTH_TOKEN_KEY } from "../../App";
import { EmailValidator } from "../../services/EmailValidator";
import { PasswordValidator } from "../../services/PasswordValidator";
import { GlobalContext } from "../../services/GlobalState";

export default function RegisterPage() {
  const { setUserConnected, setWeeklyQuota } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [departmentData, setDepartmentData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [userData, setUserData] = useState({
    email: "",
    lastname: "",
    firstname: "",
    password: "",
    departmentId: "",
    teamId: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("/api/departments/allDepartments");
        setDepartmentData(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      if (userData.departmentId) {
        try {
          const response = await axios.get(
            `/api/teams/allTeamsByDepartment/${userData.departmentId}`,
          );
          setTeamData(response.data);
          console.log("Teams ========= : ", response.data);
        } catch (error) {
          console.error("Error fetching teams:", error);
        }
      } else {
        setTeamData([]);
      }
    };

    fetchTeams();
  }, [userData.departmentId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (
      EmailValidator(userData.email) &&
      PasswordValidator(userData.password)
    ) {
      try {
        const response = await axios.post("/api/auth/register", userData);
        const jwt = response.data.token;
        sessionStorage.setItem(AUTH_TOKEN_KEY, jwt);
        const userInfoResponse = await axios.get("/api/users/userConnected", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        const userInfoData = userInfoResponse.data;
        console.log("UserInfoData :::::::: " + userInfoData);
        setUserConnected(`${userInfoData.firstname} ${userInfoData.lastname}`);
        const teamInfoResponse = await axios.get(
          `/api/teams/getTeamById/${userData.teamId}`,
        );
        const teamInfoData = teamInfoResponse.data;
        console.log("TEamInfoData :   ", teamInfoData);
        setWeeklyQuota(`${teamInfoData.memberQuota}`);
        setError("");
        navigate("/profilePage");
      } catch (error) {
        if (error.response) {
          setError(`Erreur du serveur: ${error.response.status}`);
        } else if (error.request) {
          setError("Problème de connexion, veuillez réessayer.");
        } else {
          setError("Une erreur inattendue s'est produite, veuillez réessayer.");
        }
      }
    } else {
      setError("Veuillez remplir tous les champs correctement.");
    }
  };

  return (
    <div className="main">
      <h2 style={{ color: "#1f4e5f" }}>Register</h2>
      <div className="register-container">
        <div>
          <div className="form-container">
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label htmlFor="InputEmail" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="Email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                />

                <div className="mb-3">
                  <label htmlFor="InputLastname" className="form-label">
                    LastName
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="Lastname"
                    name="lastname"
                    value={userData.lastname}
                    onChange={handleChange}
                    aria-describedby="lastnameHelp"
                  />
                  <div id="lastnameHelp" className="form-text">
                    Enter a valid lastname.
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="InputFirstname" className="form-label">
                    FirstName
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="Firstname"
                    name="firstname"
                    value={userData.firstname}
                    onChange={handleChange}
                    aria-describedby="firstnameHelp"
                  />
                  <div id="firstnameHelp" className="form-text">
                    Enter a valid firstname.
                  </div>
                </div>
                <div className="mb-3">
                  <label>Department</label>
                  <select
                    name="departmentId"
                    onChange={handleChange}
                    className="form-select"
                    value={userData.departmentId}
                  >
                    <option value="">Select a Department</option>
                    {departmentData.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label>Team</label>
                  <select
                    name="teamId"
                    onChange={handleChange}
                    className="form-select"
                    value={userData.teamId}
                    disabled={!userData.departmentId}
                  >
                    <option value="">Select a Team</option>
                    {teamData.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="Password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="Password"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    aria-describedby="passwordHelp"
                  />
                  <div id="passwordHelp" className="form-text">
                    enter a password containing at least 8 letters, a number and
                    a special character.
                  </div>
                </div>
              </div>
              {/*<div className="mb-3">*/}
              {/*  <label htmlFor="ConfirmPassword" className="form-label">*/}
              {/*    Confirm Password*/}
              {/*  </label>*/}
              {/*  <input*/}
              {/*    type="password"*/}
              {/*    className="form-control"*/}
              {/*    id="ConfirmPassword"*/}
              {/*    onChange={handleChange}*/}
              {/*  />*/}
              {/*</div>*/}
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </form>
          </div>
          <div>
            <span>Already have an account? </span>
            <Link to="/loginPage">Log in</Link>
          </div>
          {/* Afficher le message d'erreur */}
          {error && <div style={{ color: "red" }}>{error}</div>}
        </div>
      </div>
    </div>
  );
}
