import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GlobalContext } from "../../services/GlobalState";
import { getUserConnected } from "../../services/getUserConnected";
import "./ProfilePage.scss";
import PersonalInfo from "./PersonalInfo";
import LocationInfo from "./LocationInfo";
import BookingPreferences from "./BookingPreferences";

const EditProfile = () => {
  const { userConnected, setUserConnected } = useContext(GlobalContext);
  console.log("UserConnected in Profile : " + userConnected);

  const [formData, setFormData] = useState({
    lastname: "",
    firstname: "",
    department: "",
    team: "",
    country: "",
    city: "",
    office: "",
    address: "",
    floor: "",
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const updatePreference = (value) => {
    // ... La logique pour mettre à jour les préférences ...
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
      <h2>Edit profile</h2>
      <div className="accordion" id="accordionExample">
        <PersonalInfo formData={formData} handleChange={handleChange} />
        <LocationInfo formData={formData} handleChange={handleChange} />
        <BookingPreferences
          formData={formData}
          updatePreference={updatePreference}
        />
      </div>
    </div>
  );
};
export default function ProfilePage() {
  return <EditProfile />;
}
