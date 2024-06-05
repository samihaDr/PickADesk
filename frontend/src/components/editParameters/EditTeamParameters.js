import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../../services/GlobalState";
import axios from "axios";
import {AUTH_TOKEN_KEY} from "../../App";
import {useTeamList} from "../hooks/useTeamList";
import {format} from "date-fns";
import notify from "../../services/toastNotifications";

export default function EditTeamParameters() {
    const { userInfo, reservations } = useContext(GlobalContext);

    const [isLoading, setLoading] = useState(true);
    const { fetchTeamList } = useTeamList();
    const [error, setError] = useState("");
    const [allTeams, setAllTeams] = useState([]);
    const [managerTeamId, setManagerTeamId] = useState(null);
    const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);
    const [totalMembers, setTotalMembers] = useState(0);
    const [totalInOffice, setTotalInOffice] = useState(0);
    const [totalSeatsAllocated, setTotalSeatsAllocated] = useState(0);

    // Cette fonction charge les données initiales des utilisateurs et des stations de travail
    async function fetchData() {
        setLoading(true);
        notify.info("Loading team data...");
        try {
            const usersResponse = await axios.get(`/api/users/allUsers`, { headers: { Authorization: `Bearer ${jwt}` } });
            const seatsResponse = await axios.get(`/api/workStations/all`);
            if (usersResponse.data && seatsResponse.data) {
                const totalUsers = usersResponse.data.length;
                const totalSeats = seatsResponse.data.length;
                loadAllTeams(totalUsers, totalSeats);  // Charge les équipes avec le total d'utilisateurs et de sièges
            }
        } catch (error) {
            notify.error("Failed to load initial data.");
        } finally {
            setLoading(false);
        }
    }

    async function checkColleagueAvailability(employeeId, selectedDate) {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        try {
            const url = `/api/reservations/employeeHasReservationThisDay/${employeeId}/${formattedDate}`;
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            if (response.data.success) {
                const morning = response.data.data[0]?.morning;
                const afternoon = response.data.data[0]?.afternoon;
                return {
                    workStatus: "In Office",
                    period: morning && afternoon ? "Full Day" : morning ? "Morning" : "Afternoon",
                    deskNumber: response.data.data[0]?.workStation.workPlace
                };
            } else {
                return {
                    workStatus: "Homeworking",
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

    // Cette fonction charge toutes les équipes avec le calcul des membres et des sièges
    async function loadAllTeams(totalUsers, totalSeats) {
        const today = new Date();  // Ou une autre date spécifique
        try {
            const response = await axios.get(`/api/teams/getAllTeams`);
            const sortedData = response.data.sort((a, b) => a.name.localeCompare(b.name));
            const teamsWithDetails = await Promise.all(sortedData.map(async team => {
                const membersResponse = await fetchTeamList(team.id);
                const totalMembers = membersResponse.length;
                const percent = (totalMembers * 100) / totalUsers;
                const seatsAllocated = Math.round((percent / 100) * totalSeats);

                // Utilisation de checkColleagueAvailability pour chaque membre
                const membersAvailability = await Promise.all(membersResponse.map(member =>
                    checkColleagueAvailability(member.id, today)
                ));
                const inOfficeCount = membersAvailability.filter(status => status.workStatus === 'In Office').length;

                return { ...team, membersCount: totalMembers, percent, seatsAllocated, inOfficeCount };
            }));

            // calcul des totaux
            const totalMembersSum = teamsWithDetails.reduce((acc, team) => acc + team.membersCount, 0);
            const totalInOfficeSum = teamsWithDetails.reduce((acc, team) => acc + team.inOfficeCount, 0);
            const totalSeatsAllocatedSum = teamsWithDetails.reduce((acc, team) => acc + team.seatsAllocated, 0);

            setTotalMembers(totalMembersSum);
            setTotalInOffice(totalInOfficeSum);
            setTotalSeatsAllocated(totalSeatsAllocatedSum);

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
    }, [userInfo, jwt, reservations]);

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
            notify.error('Team not found');
            return;
        }
        try {
            await axios.put(`/api/teams/updateQuota/${id}`, {
                teamQuotaMin: teamUpdated.teamQuotaMin,
                teamQuotaMax: teamUpdated.teamQuotaMax
            });
            notify.success('Quota updated successfully!');

        } catch (error) {
            console.error('Failed to update quota', error);
            notify.error(`Failed to update quota: ${error.response.data.message || error.message}`);
        }
    };
    const revertChanges = () => {
        notify.info("Resetting changes...");
        loadAllTeams();
        fetchData();

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
                        <th>Presence at the office</th>
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
                            <td>{team.inOfficeCount}</td>
                        </tr>
                    ))}
                    <tr>
                        <th>Total</th>
                        <th>{totalMembers}</th>
                        <th>-</th> {/* Vous pourriez vouloir calculer un pourcentage global si pertinent */}
                        <th>{totalSeatsAllocated}</th>
                        <th>-</th> {/* Min et Max ne sont pas totalisés ici */}
                        <th>-</th>
                        <th>{totalInOffice}</th>
                    </tr>
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