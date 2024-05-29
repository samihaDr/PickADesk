import React, {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../../services/GlobalState";
import axios from "axios";
import {AUTH_TOKEN_KEY} from "../../App";
import "./TeamSettings.scss"
import {useTeamList} from "../hooks/useTeamList";
import {endOfWeek, format, startOfWeek,  isValid, parseISO} from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import worker from "../../assets/icons/worker.png";
import home from "../../assets/icons/home.png";
import clock from "../../assets/icons/clock.png";
import morning from "../../assets/icons/morning.png";
import afternoon from "../../assets/icons/afternoon.png";

export default function TeamSettings() {

    const {userInfo = {}} = useContext(GlobalContext);
    const {teamList, setTeamList, fetchTeamList, isLoading, error} = useTeamList();
    const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);
    const [activeTab, setActiveTab] = useState('daily');  // Gestion de l'onglet actif
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        if (userInfo && userInfo.teamId) {
            fetchTeamList(userInfo.teamId, jwt);
        }
    }, [userInfo]);

    async function updateMembersWithDetails(members, date) {
        const membersWithDetails = await Promise.all(members.map(async member => {
            const availability = await checkColleagueAvailability(member.id, date);
            const { totalDaysReserved, reservationsDetails } = await employeeWeeklyReservations(member.id, date);
            const daysWorked = getDaysPerWeek(member.workSchedule);

            console.log(`Member ${member.id} reservations:`, reservationsDetails);
            return {
                ...member,
                ...availability,
                weeklyReservations: reservationsDetails,
                daysWorked,
                teleworkingDays: daysWorked - totalDaysReserved,
                daysInOffice: totalDaysReserved,
                balance: member.memberQuota - totalDaysReserved
            };
        }));
        console.log("Updated members with details:", membersWithDetails);
        // Comparaison simple des objets JSON avant mise à jour
        if (JSON.stringify(membersWithDetails) !== JSON.stringify(teamList)) {
            setTeamList(membersWithDetails);
        }
    }

    useEffect(() => {
        if (teamList.length > 0 && selectedDate ) {
            updateMembersWithDetails(teamList, selectedDate);
        }
    }, [teamList, selectedDate]);

    async function checkColleagueAvailability(employeeId, selectedDate) {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        try {
            const url = `/api/reservations/employeeHasReservationThisDay/${employeeId}/${formattedDate}`;
            const response = await axios.get(url, {
                headers: {Authorization: `Bearer ${jwt}`},
            });
            console.log("Selected Date : ", selectedDate);
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

    async function employeeWeeklyReservations(employeeId, selectedDate) {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        try {
            const url = `/api/reservations/getReservationsForWeek/${employeeId}/${formattedDate}`;
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
                            status: fullDay ? "Full Day" : reservation.morning ? "Morning" : "Afternoon",
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
    const teleworkingCount = teamList.filter(member => member.workStatus === 'Homeworking').length;
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
    const currentDate = format(selectedDate, 'dd/MM/yyyy'); // Date actuelle formatée
    const startDate = startOfWeek(selectedDate, {weekStartsOn: 1}); // Début de la semaine
    const endDate = endOfWeek(selectedDate, {weekStartsOn: 1}); // Fin de la semaine
    const formattedStartDate = format(startDate, 'dd/MM/yyyy'); // Date formatée du début de la semaine
    const formattedEndDate = format(endDate, 'dd/MM/yyyy'); // Date formatée de la fin de la semaine
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    function getBackgroundColor(period) {
        switch (period) {
            case 'Full Day':
                return '#44d095'; // Green for a full day
            case 'Morning':
                return '#ADD8E6'; // Light blue for morning
            case 'Afternoon':
                return '#FFEF4F'; // Yellow for afternoon
            default:
                return 'transparent'; // Transparent if no reservation
        }
    }

    return (
        <div className="main">
            <h2>My Team </h2>
            <div className="tabs">
                <button className={activeTab === 'daily' ? 'active' : ''} onClick={() => setActiveTab('daily')}>Daily Stats</button>
                <button className={activeTab === 'weekly' ? 'active' : ''} onClick={() => setActiveTab('weekly')}>Weekly Stats</button>
            </div>
            <div className="date-picker-container">
                <span className="datepicker-icon">📅</span>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="dd/MM/yyyy"
                />
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : activeTab === 'daily' ? (
                <>

                    <h2>Daily Team Statistics - <span className="date-span">{currentDate}</span></h2>
                    <div className="result">
                        <table>
                            <thead>
                            <tr>
                                <th>Lastname</th>
                                <th>Firstname</th>
                                <th>WorkStatus</th>
                                <th>Session</th>
                                <th>WorkPlace</th>
                            </tr>
                            </thead>
                            <tbody>
                            {teamList.map((member, index) => (
                                <tr key={index}>
                                    <td>{member.lastname}</td>
                                    <td>{member.firstname}</td>
                                    <td className="icon-cell">
                                        {member.workStatus === 'In Office' ? (
                                            <img src={worker} alt="In Office" style={{ width: '25px' }} />
                                        ) : member.workStatus === 'Homeworking' ? (
                                            <img src={home} alt="Homeworking" style={{ width: '25px' }} />
                                        ) : (
                                            <span>{member.workStatus}</span>
                                        )}
                                    </td>
                                    <td style={{ backgroundColor: getBackgroundColor(member.period), textAlign: 'center', verticalAlign: 'middle' }}>
                                        {member.period === 'Full Day' ? (
                                            <img src={clock} alt="Full Day" style={{ width: '25px' }} />
                                        ) : member.period === 'Morning' ? (
                                            <img src={morning} alt="Morning" style={{ width: '25px' }} />
                                        ) : member.period === 'Afternoon' ? (
                                            <img src={afternoon} alt="Afternoon" style={{ width: '25px' }} />
                                        ) : (
                                            <span>{member.period}</span>
                                        )}
                                    </td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{member.deskNumber}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <br/>
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
                            <label><strong>Homeworking</strong></label>
                            <div className="progress">
                                <div className="progress-bar" role="progressbar"
                                     style={{width: `${teleworkingPercent}%`, backgroundColor: '#28a745'}} aria-valuemin="0"
                                     aria-valuemax="100">{teleworkingPercent}%
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {isManager ? (
                        <>
                            <h2>Weekly Team Statistics - <span className="date-span">{formattedStartDate} to {formattedEndDate}</span></h2>

                            <div className="stats">

                                <table>
                                    <thead>
                                    <tr>
                                        <th>Lastname</th>
                                        <th>Firstname</th>
                                        <th>Work Plan</th>
                                        <th>Allowed Homeworking</th>
                                        <th>Days In Office</th>
                                        <th>Weekly Balance</th>
                                        {daysOfWeek.map(day => <th key={day}>{day}</th>)}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {teamList.map((member, index) => (
                                        <tr key={index}>
                                            <td>{member.lastname}</td>
                                            <td>{member.firstname}</td>
                                            <td>{getDaysPerWeek(member.workSchedule)} days</td>
                                            <td>{member.memberQuota} days</td>
                                            <td>{member.daysInOffice}</td>
                                            <td>{member.balance}</td>
                                            {daysOfWeek.map(day => {
                                                const dayInfo = member.weeklyReservations && member.weeklyReservations.find(d => d.day === day);
                                                let backgroundColor = '#FFFFFF'; // Default background
                                                let content = null; // Content of the cell

                                                if (dayInfo) {
                                                    switch (dayInfo.type) {
                                                        case 'fullDay':
                                                            backgroundColor = '#44d095'; // Full day
                                                            content = <img src={clock} alt="Full Day" style={{ width: '25px' }} />;
                                                            break;
                                                        case 'morning':
                                                            backgroundColor = '#ADD8E6'; // Morning only
                                                            content = <img src={morning} alt="Morning" style={{ width: '25px' }} />;
                                                            break;
                                                        case 'afternoon':
                                                            backgroundColor = '#FFEF4F'; // Afternoon only
                                                            content = <img src={afternoon} alt="Afternoon" style={{ width: '25px' }} />;
                                                            break;
                                                        default:
                                                            content = dayInfo.status; // Default text or no reservation
                                                            break;
                                                    }
                                                }
                                                // else {
                                                //     content = <img src={home} alt="Homeworking" style={{ width: '25px' }} />;
                                                // }

                                                return <td key={day} style={{ backgroundColor, textAlign: 'center', verticalAlign: 'middle' }}>{content}</td>;
                                            })}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="stats">
                            <h2>My Personal Statistics - <span className="date-span">{formattedStartDate} to {formattedEndDate}</span></h2>
                            {getPersonalStats() ? (
                                <table>
                                    <thead>
                                    <tr>
                                        {daysOfWeek.map(day => <th key={day}>{day}</th>)}
                                        <th>Days In Office</th>
                                        <th>Weekly Balance</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        {daysOfWeek.map(day => {
                                            const dayInfo = getPersonalStats().weeklyReservations && getPersonalStats().weeklyReservations.find(d => d.day === day);
                                            let backgroundColor = '#FFFFFF'; // Default background
                                            let content = null; // Content of the cell
                                            if (dayInfo) {
                                                switch (dayInfo.type) {
                                                    case 'fullDay':
                                                        backgroundColor = '#44d095'; // Full day
                                                        content = <img src={clock} alt="Full Day" style={{ width: '25px' }} />;
                                                        break;
                                                    case 'morning':
                                                        backgroundColor = '#ADD8E6'; // Morning only
                                                        content = <img src={morning} alt="Morning" style={{ width: '25px' }} />;
                                                        break;
                                                    case 'afternoon':
                                                        backgroundColor = '#FFEF4F'; // Afternoon only
                                                        content = <img src={afternoon} alt="Afternoon" style={{ width: '25px' }} />;
                                                        break;
                                                }
                                            }
                                            return <td key={day} style={{ backgroundColor, textAlign: 'center', verticalAlign: 'middle'  }}>{content}</td>;
                                        })}
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{getPersonalStats().daysInOffice}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{getPersonalStats().balance}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            ) : (
                                <p>No personal statistics available.</p>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}