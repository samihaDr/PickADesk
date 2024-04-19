import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../services/GlobalState";
import axios from "axios";
import { AUTH_TOKEN_KEY } from "../../App";
import "./TeamSettings.scss"
export default function TeamSettings() {
  const { userInfo } = useContext(GlobalContext);
  const [teamList, setTeamList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teamId, setTeamId] = useState("");
  const [shouldUpdateStatuses, setShouldUpdateStatuses] = useState(false);
  const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);

  useEffect(() => {
    if (userInfo && userInfo.teamId !== undefined) {
      setTeamId(userInfo.teamId);
      console.log("TeamID : ", teamId);
      fetchTeamList();
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchStatuses = async () => {
      const statusPromises = teamList.map(member =>
          checkColleagueAvailability(member.id)
      );
      const statuses = await Promise.all(statusPromises);
      const updatedTeamList = teamList.map((member, index) => ({
        ...member,
        ...statuses[index],
      }));
      setTeamList(updatedTeamList);
      setShouldUpdateStatuses(false);
    };

    if (shouldUpdateStatuses) {
      fetchStatuses();
    }
  }, [shouldUpdateStatuses]);

  async function fetchTeamList() {
    if (!teamId) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/users/getTeamList/${teamId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("API Response 1:", response.data);
      if (Array.isArray(response.data)) {
        const sortedData = response.data
            // .filter((member) => member.id !== userInfo.id)
            .sort((b, a) => a.lastname.localeCompare(b.lastname));
        setTeamList(sortedData);
        setShouldUpdateStatuses(true);  // Trigger status updates only after team list is updated
      }
    } catch (error) {
      console.error("Fetch team list error:", error);
      setError("Unable to load the list of employees.");
    } finally {
      setLoading(false);
    }
  }

  async function checkColleagueAvailability(employeeId) {
    try {
      const url = `/api/reservations/employeeHasReservationToday/${employeeId}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("API Response2:", response.data);
      if (response.data.success && response.data.data.length > 0) {
        const reservation = response.data.data[0];  // Suppose using only the first reservation
        return {
          workStatus: "In Office",
          period: reservation.morning ? "Morning" : "Afternoon",
          deskNumber: reservation.workStation.workPlace
        };
      } else {
        return {
          workStatus: "Teleworking",
          period: null,
          deskNumber: null
        };
      }
    } catch (error) {
      console.error("Error checking reservation:", error);
      return {
        workStatus: "Error checking status",
        period: null,
        deskNumber: null
      };
    }
  }

  // Calcul des pourcentages
  const totalCount = teamList.length;
  const inOfficeCount = teamList.filter(member => member.workStatus === 'In Office').length;
  const teleworkingCount = teamList.filter(member => member.workStatus === 'Teleworking').length;
  const inOfficePercent = ((inOfficeCount / totalCount) * 100).toFixed(0);
  const teleworkingPercent = ((teleworkingCount / totalCount) * 100).toFixed(0);
  return (
      <div className="main">
        <h2>Team static</h2>
        <div className="progress-bars">
          <div>
            <label><strong>In Office </strong></label>

            <div className="progress">
              <div className="progress-bar" role="progressbar" style={{ width: `${inOfficePercent}%`, backgroundColor: '#007bff' }} aria-valuenow="{inOfficePercent}" aria-valuemin="0" aria-valuemax="100">{inOfficePercent}%</div>
            </div>
          </div>
          <div>
            <label><strong>Teleworking</strong> </label>
            <div className="progress">
              <div className="progress-bar" role="progressbar" style={{ width: `${teleworkingPercent}%`, backgroundColor: '#28a745' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{teleworkingPercent}%</div>
            </div>
          </div>
        </div>



        <h2>My team</h2>
        {isLoading ? (
            <p>Loading...</p>
        ) : error ? (
            <p>{error}</p>
        ) : (
            <div className="result">
              <table>
                <thead>
                <tr>
                  <th>Firstname</th>
                  <th>Lastname</th>
                  <th>WorkStatus</th>
                  <th>Session</th>
                  <th>WorkPlace</th>
                </tr>
                </thead>
                <tbody>
                {teamList.map((member, index) => (
                    <tr key={index}>
                      <td>{member.firstname}</td>
                      <td>{member.lastname}</td>
                      <td>{member.workStatus}</td>
                      <td>{member.period}</td>
                      <td>{member.deskNumber}</td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}

        {/*<h2>My static</h2>*/}
      </div>
  );
}
