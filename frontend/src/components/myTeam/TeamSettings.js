import {useContext, useEffect} from "react";
import {GlobalContext} from "../../services/GlobalState";
import axios from "axios";
import {AUTH_TOKEN_KEY} from "../../App";
import "./TeamSettings.scss"
import {useTeamList} from "../hooks/useTeamList";
import {endOfWeek, format, startOfWeek,  isValid, parseISO} from "date-fns";
export default function TeamSettings() {
    const {userInfo = {}} = useContext(GlobalContext);
    const {teamList, setTeamList, fetchTeamList, isLoading, error} = useTeamList();
    const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);

    useEffect(() => {
        if (userInfo && userInfo.teamId) {
            fetchTeamList(userInfo.teamId);
        }
    }, [userInfo]);


    async function updateMembersWithDetails(members) {
        const membersWithDetails = await Promise.all(members.map(async member => {
            const availability = await checkColleagueAvailability(member.id);
            const { totalDaysReserved, reservationsDetails } = await employeeWeeklyReservations(member.id);
            const daysWorked = getDaysPerWeek(member.workSchedule);
            console.log(`Member ${member.id} reservations:`, reservationsDetails);
            return {
                ...member,
                ...availability,
                weeklyReservations: reservationsDetails,
                daysWorked,
                teleworkingDays: daysWorked - totalDaysReserved,
                daysInOffice: totalDaysReserved
            };
        }));
        console.log("Updated members with details:", membersWithDetails);
        // Comparaison simple des objets JSON avant mise à jour
        if (JSON.stringify(membersWithDetails) !== JSON.stringify(teamList)) {
            setTeamList(membersWithDetails);
        }
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
            let reservationsDetails = [];
            console.log("Response employeeWeeklyReservations : ", response.data.reservations);
            if (response.data && response.data.reservations) {
                response.data.reservations.forEach((reservation) => {
                    const date = parseISO(reservation.reservationDate);
                    if (isValid(date)) {
                        const dayFormatted = format(date, 'EEEE');
                        const fullDay = reservation.morning && reservation.afternoon;
                        // const halfDay = reservation.morning || reservation.afternoon;
                        totalDaysReserved += fullDay ? 1 : 0.5;
                        let reservationType = '';
                        if (reservation.morning && reservation.afternoon) {
                            reservationType = "fullDay";
                        } else if (reservation.morning) {
                            reservationType = "morning";
                        } else if (reservation.afternoon) {
                            reservationType = "afternoon";
                        }
                        reservationsDetails.push({
                            day: dayFormatted,
                            status: fullDay ? "Full Day In Office" : reservation.morning ? "Morning In Office" : "Afternoon In Office",
                            type: reservationType
                        });
                    }
                });
            }
            console.log("ReservationsDetails in SettingsTeam :", reservationsDetails);
            return {totalDaysReserved, reservationsDetails};
        } catch (error) {
            console.error("Error fetching weekly reservations:", error);
            return {totalDaysReserved: 0, reservationsDetails: []};
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

    const isManager = userInfo?.role === "MANAGER";
    const currentDate = format(new Date(), 'dd/MM/yyyy'); // Date actuelle formatée
    const startDate = startOfWeek(new Date(), {weekStartsOn: 1}); // Début de la semaine
    const endDate = endOfWeek(new Date(), {weekStartsOn: 1}); // Fin de la semaine
    const formattedStartDate = format(startDate, 'dd/MM/yyyy'); // Date formatée du début de la semaine
    const formattedEndDate = format(endDate, 'dd/MM/yyyy'); // Date formatée de la fin de la semaine
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    return (
        <div className="main">
            <h2>My Team - <span className="date-span">{currentDate}</span></h2>
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
            <h2>Daily Team Statistics - <span className="date-span">{currentDate}</span></h2>
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
                    <h2> Weekly Team Statistics  - <span className="date-span">{formattedStartDate} to {formattedEndDate}</span></h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Work Plan</th>
                            {daysOfWeek.map(day => <th key={day}>{day}</th>)}
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
                                {daysOfWeek.map(day => {
                                    const dayInfo = member.weeklyReservations && Array.isArray(member.weeklyReservations)
                                        ? member.weeklyReservations.find(d => d.day === day)
                                        : null;
                                    let backgroundColor = '#FFFFFF'; // Default background
                                    if (dayInfo) {
                                        switch (dayInfo.type) {
                                            case 'fullDay':
                                                backgroundColor = '#44d095'; // Full day
                                                break;
                                            case 'morning':
                                                backgroundColor = '#ADD8E6'; // Morning only
                                                break;
                                            case 'afternoon':
                                                backgroundColor = '#FFEF4F'; // Afternoon only
                                                break;
                                        }
                                    }
                                    return <td key={day} style={{ backgroundColor: backgroundColor }}>{dayInfo ? dayInfo.status : "Teleworking"}</td>;
                                })}
                                <td>{member.teleworkingDays}</td>
                                <td>{member.daysInOffice}</td>

                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="stats">
                    <h2>My Personal Statistics - <span className="date-span">{formattedStartDate} to {formattedEndDate}</span></h2>
                    {getPersonalStats() ? (
                        <table>
                            <thead>
                            <tr>
                                {daysOfWeek.map(day => <th key={day}>{day}</th>)}
                                <th>Days Teleworking</th>
                                <th>Days In Office</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                {/*<td>{getPersonalStats().daysWorked}</td>*/}
                                {daysOfWeek.map(day => {
                                    const dayInfo = getPersonalStats().weeklyReservations && Array.isArray(getPersonalStats().weeklyReservations)
                                        ? getPersonalStats().weeklyReservations.find(d => d.day === day)
                                        : null;
                                    let backgroundColor = '#FFFFFF'; // Default background
                                    if (dayInfo) {
                                        switch (dayInfo.type) {
                                            case 'fullDay':
                                                backgroundColor = '#44d095'; // Full day
                                                break;
                                            case 'morning':
                                                backgroundColor = '#ADD8E6'; // Morning only
                                                break;
                                            case 'afternoon':
                                                backgroundColor = '#FFEF4F'; // Afternoon only
                                                break;
                                        }
                                    }
                                    return <td key={day} style={{ backgroundColor: backgroundColor }}>{dayInfo ? dayInfo.status : "Teleworking"}</td>;
                                })}
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