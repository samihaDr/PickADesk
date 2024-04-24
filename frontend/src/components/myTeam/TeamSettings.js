import {useContext, useEffect} from "react";
import {GlobalContext} from "../../services/GlobalState";
import axios from "axios";
import {AUTH_TOKEN_KEY} from "../../App";
import "./TeamSettings.scss"
import {useTeamList} from "../hooks/useTeamList";

export default function TeamSettings() {
    const {userInfo} = useContext(GlobalContext);
    const { teamList, setTeamList, fetchTeamList, isLoading, error } = useTeamList();
    const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);

    useEffect(() => {
        if (userInfo && userInfo.teamId) {
            fetchTeamList(userInfo.teamId);
        }
    }, [userInfo]);


    async function updateMembersWithDetails(members) {
        const membersWithDetails = await Promise.all(members.map(async member => {
            const availability = await checkColleagueAvailability(member.id);
            const weeklyReservations = await employeeWeeklyReservations(member.id);
            const daysWorked = getDaysPerWeek(member.workSchedule);
            return {
                ...member,
                ...availability,
                weeklyReservations,
                daysWorked,
                teleworkingDays: weeklyReservations,
                daysInOffice: daysWorked - weeklyReservations
            };
        }));
        setTeamList(membersWithDetails);
    }
    useEffect(() => {
        if (teamList.length > 0) {
            updateMembersWithDetails(teamList);
        }
    }, [teamList]);
    async function checkColleagueAvailability(employeeId) {
        try {
            const url = `/api/reservations/employeeHasReservationToday/${employeeId}`;
            const response = await axios.get(url, {
                headers: {Authorization: `Bearer ${jwt}`},
            });
            return response.data.success ? {
                workStatus: "In Office",
                period: response.data.data[0]?.morning ? "Morning" : "Afternoon",
                deskNumber: response.data.data[0]?.workStation.workPlace
            } : {
                workStatus: "Teleworking",
                period: null,
                deskNumber: null
            };
        } catch (error) {
            console.error("Error checking reservation:", error);
            return {
                workStatus: "Error checking status",
                period: null,
                deskNumber: null
            };
        }
    }

    async function employeeWeeklyReservations(employeeId) {
        try {
            const url = `/api/reservations/getReservationsForWeek/${employeeId}`;
            const response = await axios.get(url, {
                headers: {Authorization: `Bearer ${jwt}`},
            });
            let totalDaysReserved = 0;

            if (response.data.reservations) {
                response.data.reservations.forEach((reservation) => {
                    if (reservation.morning && reservation.afternoon) {
                        totalDaysReserved += 1;
                    } else if (reservation.morning || reservation.afternoon) {
                        totalDaysReserved += 0.5;
                    }
                });
            }
            return totalDaysReserved;
        } catch (error) {
            console.error("Error fetching weekly reservations:", error);
            return 0;
        }
    }

    // Calcul des pourcentages
    const totalCount = teamList.length;
    const inOfficeCount = teamList.filter(member => member.workStatus === 'In Office').length;
    const teleworkingCount = teamList.filter(member => member.workStatus === 'Teleworking').length;
    const inOfficePercent = ((inOfficeCount / totalCount) * 100).toFixed(0);
    const teleworkingPercent = ((teleworkingCount / totalCount) * 100).toFixed(0);

    function getDaysPerWeek(schedule) {
        const scheduleDays = {
            "FULL_TIME": 5,
            "HALF_TIME": 2.5,
            "FOUR_FIFTHS": 4
        };
        return scheduleDays[schedule] || 0;
    }

    function getPersonalStats() {
        return teamList.find(member => member.id === userInfo.id);
    }

    const isManager = userInfo.role === "MANAGER";

    return (
        <div className="main">
            <h2>My Team</h2>
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
            <h2>Daily Team Statistics </h2>
            <div className="progress-bars">
                <div>
                    <label><strong> In Office </strong></label>

                    <div className="progress">
                        <div className="progress-bar" role="progressbar"
                             style={{width: `${inOfficePercent}%`, backgroundColor: '#007bff'}} aria-valuemin="0"
                             aria-valuemax="100">{inOfficePercent}%
                        </div>
                    </div>
                </div>
                <div>
                    <label><strong>Teleworking</strong> </label>
                    <div className="progress">
                        <div className="progress-bar" role="progressbar"
                             style={{width: `${teleworkingPercent}%`, backgroundColor: '#28a745'}} aria-valuemin="0"
                             aria-valuemax="100">{teleworkingPercent}%
                        </div>
                    </div>
                </div>
            </div>


            {isManager ? (
                <div className="stats">
                    <h2> Weekly Team Statistics</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Days Worked</th>
                            <th>Days Teleworking</th>
                            <th>Days In Office</th>
                        </tr>
                        </thead>
                        <tbody>
                        {teamList.map((member, index) => (
                            <tr key={index}>
                                <td>{member.firstname}</td>
                                <td>{member.lastname}</td>
                                <td>{getDaysPerWeek(member.workSchedule)} days</td>
                                <td>{member.teleworkingDays}</td>
                                <td>{member.daysInOffice}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="stats">
                    <h2>My Personal Statistics</h2>
                    {getPersonalStats() ? (
                        <table>
                            <thead>
                            <tr>
                                <th>Days Worked</th>
                                <th>Days Teleworking</th>
                                <th>Days In Office</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{getPersonalStats().daysWorked}</td>
                                <td>{getPersonalStats().teleworkingDays}</td>
                                <td>{getPersonalStats().daysInOffice}</td>
                            </tr>
                            </tbody>
                        </table>
                    ) : (
                        <p>No personal statistics available.</p>
                    )}
                </div>
            )}
        </div>
    );
}
