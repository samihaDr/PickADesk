import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GlobalContext } from "../../services/GlobalState";
import { getUserConnected } from "../../services/getUserConnected";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { userConnected, setUserConnected } = useContext(GlobalContext);
  console.log("UserConnected in Profile : " + userConnected);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lastname: "",
    firstname: "",
    department: "",
    team: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserConnected();
        setFormData((prevFormData) => ({
          ...prevFormData,
          lastname: userData.lastname,
          firstname: userData.firstname,
        }));
        console.log(
          "UserData In ProfilePage : ",
          userData.lastname,
          userData.firstname,
        );

        // Appel de la fonction fetchDepartment
        await fetchDepartment(userData.teamId);
        // Appel de la fonction fetchTeam
        await fetchTeam(userData.teamId);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de l'utilisateur :",
          error,
        );
        setError(
          "Une erreur est survenue lors de la récupération des données de l'utilisateur.",
        );
      }
    };

    const fetchDepartment = async (teamId) => {
      try {
        const response = await axios.get(
          `/api/departments/getDepartment/${teamId}`,
        );
        const departmentData = response.data;
        setFormData((prevFormData) => ({
          ...prevFormData,
          department: departmentData.name,
        }));
        console.log("UserDepartment In ProfilePage : ", departmentData.name);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    const fetchTeam = async (teamId) => {
      try {
        const response = await axios.get(`/api/teams/getTeamById/${teamId}`);
        const teamData = response.data;
        setFormData((prevFormData) => ({
          ...prevFormData,
          team: teamData.name, // ou la propriété appropriée
        }));
        console.log("UserTeam In ProfilePage : ", teamData.name);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleChangePasswordClick = () => {
    navigate("/changePassword"); // Redirige vers la page de changement de mot de passe
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.put(
        `/api/users/editProfile/${userConnected.id}`,
        formData,
      );
      setUserConnected(response.data);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      setError("Une erreur est survenue lors de la mise à jour du profil.");
    }
  };

  if (!userConnected) {
    return <div>User not found</div>;
  }

  return (
    <div className="main">
      <h2 style={{ color: "#1f4e5f" }}>Edit profile</h2>
      <div className="editProfile-container">
        <div>
          <div className="form-container">
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label htmlFor="InputLastname" className="form-label">
                  LastName
                </label>
                <input
                  disabled={true}
                  type="text"
                  className="form-control"
                  id="Lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="InputFirstname" className="form-label">
                  FirstName
                </label>
                <input
                  disabled={true}
                  type="text"
                  className="form-control"
                  id="Firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="InputDepartment" className="form-label">
                  Department
                </label>
                <input
                  disabled={true}
                  type="text"
                  className="form-control"
                  id="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="InputTeam" className="form-label">
                  Team
                </label>
                <input
                  disabled={true}
                  type="text"
                  className="form-control"
                  id="Team"
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleChangePasswordClick}
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default function ProfilePage() {
  return <EditProfile />;
}
