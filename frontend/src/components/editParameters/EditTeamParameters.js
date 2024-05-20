import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../../services/GlobalState";
import axios from "axios";
import {AUTH_TOKEN_KEY} from "../../App";
import {useTeamList} from "../hooks/useTeamList";

export default function EditTeamParameters() {
    const { userInfo } = useContext(GlobalContext);
    const [isLoading, setLoading] = useState(true);
    const { fetchTeamList } = useTeamList();
    const [error, setError] = useState("");
    const [allTeams, setAllTeams] = useState([]);
    const [managerTeamId, setManagerTeamId] = useState(null);
    const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);

    // Cette fonction charge les données initiales des utilisateurs et des stations de travail
    async function fetchData() {
        setLoading(true);
        try {
            const usersResponse = await axios.get(`/api/users/allUsers`, { headers: { Authorization: `Bearer ${jwt}` } });
            const seatsResponse = await axios.get(`/api/workStations/all`);
            if (usersResponse.data && seatsResponse.data) {
                const totalUsers = usersResponse.data.length;
                const totalSeats = seatsResponse.data.length;
                loadAllTeams(totalUsers, totalSeats);  // Charge les équipes avec le total d'utilisateurs et de sièges
            }
        } catch (error) {
            setError(`Error fetching initial data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    // Cette fonction charge toutes les équipes avec le calcul des membres et des sièges
    async function loadAllTeams(totalUsers, totalSeats) {
        try {
            const response = await axios.get(`/api/teams/getAllTeams`);
            const sortedData = response.data.sort((a, b) =>
                a.name.localeCompare(b.name),
            );
            const teamsWithDetails = await Promise.all(response.data.map(async team => {
                const membersResponse = await fetchTeamList(team.id);
                const totalMembers = membersResponse.length;
                const percent = (totalMembers * 100) / totalUsers;
                const seatsAllocated = Math.round((percent / 100) * totalSeats);
                return { ...team, membersCount: totalMembers, percent, seatsAllocated };
            }));
            setAllTeams(sortedData);
            setAllTeams(teamsWithDetails);
        } catch (error) {
            setError(`Error loading teams: ${error.message}`);
        }
    }

    // j'utilise useEffect pour déclencher les données initiales une fois
    useEffect(() => {
        if (userInfo && userInfo.teamId && jwt) {
            fetchData();
            setManagerTeamId(userInfo.teamId);
        }
    }, [userInfo, jwt]);

    function handleMinChange(e, teamId) {
        const newMin = e.target.value;
        setAllTeams(allTeams.map(team => {
            if (team.id === teamId) {
                return {...team, teamQuotaMin: newMin};
            }
            return team;
        }));
    }

    function handleMaxChange(e, teamId) {
        const newMax = e.target.value;
        setAllTeams(allTeams.map(team => {
            if (team.id === teamId) {
                return {...team, teamQuotaMax: newMax};
            }
            return team;
        }));
    }

    const saveQuotas = async (id) => {
        const teamUpdated = allTeams.find(team => team.id === id);
        if (!teamUpdated) {
            console.error('Team not found');
            return;
        }
        try {
            await axios.put(`/api/teams/updateQuota/${id}`, {
                teamQuotaMin: teamUpdated.teamQuotaMin,
                teamQuotaMax: teamUpdated.teamQuotaMax
            });
            alert('Quota updated successfully!');

        } catch (error) {
            console.error('Failed to update quota', error);
        }
    };
    const revertChanges = () => {
        loadAllTeams();
    };

    return (
        <div className="main">
            <h2>Edit Team Quotas</h2>
            <div className="edit-parameters">
                {isLoading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                <table>
                    <thead>
                    <tr>
                        <th>Team</th>
                        <th>Members</th>
                        <th>%</th>
                        <th>Seats</th>
                        <th>Min</th>
                        <th>Max</th>
                    </tr>
                    </thead>
                    <tbody>
                    {allTeams.map((team) => (
                        <tr key={team.id}
                            style={{backgroundColor: team.id === managerTeamId ? 'lightblue' : '#f9f9f9'}}>
                            <td>{team.name}</td>
                            <td>{team.membersCount}</td>
                            <td>{typeof team.percent === 'number' ? team.percent.toFixed(2) + '%' : 'N/A'}</td>
                            <td>{team.seatsAllocated}</td>
                            <td>
                                <input
                                    type="number"
                                    value={team.teamQuotaMin}
                                    onChange={(e) => handleMinChange(e, team.id)}
                                    disabled={team.id !== managerTeamId}
                                    step="1"
                                    min="2"
                                    max="15"
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={team.teamQuotaMax}
                                    onChange={(e) => handleMaxChange(e, team.id)}
                                    disabled={team.id !== managerTeamId}
                                    step="1"
                                    min="2"
                                    max="15"
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="button-group">
                <button className="btn-info" onClick={revertChanges}>Reset</button>
                <button className="btn-primary" onClick={() => saveQuotas(managerTeamId)}>Save</button>
            </div>
        </div>
    );
}