import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../services/GlobalState";
import axios from "axios";
import { AUTH_TOKEN_KEY } from "../../App";

export default function TeamSettings() {
  const { userInfo } = useContext(GlobalContext);
  const [teamList, setTeamList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teamId, setTeamId] = useState("");

  useEffect(() => {
    if (userInfo.id) {
      setTeamId(userInfo.teamId);
      console.log("TeamID : ", userInfo.teamId);
    }
    fetchTeamList();
  }, [userInfo]);

  async function fetchTeamList() {
    if (!teamId) return; // ajout d'une garde pour s'assurer que teamId est défini
    setLoading(true);
    try {
      const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);
      const response = await axios.get(`/api/users/getTeamList/${teamId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("API Response:", response.data); // Log pour voir la réponse
      if (Array.isArray(response.data)) {
        // Vérifiez si la réponse est un tableau
        const sortedData = response.data
          .filter((member) => member.id !== userInfo.id)
          .sort((b, a) => a.lastname.localeCompare(b.lastname));
        setTeamList(sortedData);
      }
    } catch (error) {
      console.error("Fetch team list error:", error);
      setError("Unable to load the list of employees.");
    } finally {
      setLoading(false);
    }
  }

  // async function fetchColleagueAvaibility(){
  //   try {
  //     const response = await axios.get('')
  //   }
  // }

  return (
    <div className="main">
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>WorkStatus</th>
              <th>WorkPlace</th>
            </tr>
          </thead>
          <tbody>
            {teamList.map((member, index) => (
              <tr key={index}>
                <td>{member.firstname}</td>
                <td>{member.lastname}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
