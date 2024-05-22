import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../../services/GlobalState";
import {useTeamList} from "../hooks/useTeamList";
import {AUTH_TOKEN_KEY} from "../../App";
import axios from "axios";
import "./EditMemberParameters.scss";

export default function EditMemberParameters() {
    const {userInfo, setUserInfo} = useContext(GlobalContext);
    const {teamList, setTeamList, fetchTeamList} = useTeamList();
    const jwt = sessionStorage.getItem(AUTH_TOKEN_KEY);
    const [modifiedIds, setModifiedIds] = useState({});

    useEffect(() => {
        if (userInfo && userInfo.teamId) {
            fetchTeamList(userInfo.teamId, jwt);
        }
    }, [userInfo, jwt]);

    const handleQuotaChange = (id, newQuota) => {
        const maxQuota = getDaysPerWeek(teamList.find(member => member.id === id).workSchedule);
        if (newQuota >= 1 && newQuota <= maxQuota) {
            setTeamList(teamList.map(member =>
                member.id === id ? {...member, memberQuota: newQuota} : member
            ));
            setModifiedIds(prev => ({...prev, [id]: true}));
        } else {
            console.error('Invalid quota');
        }
    };

    const saveQuota = async (id) => {
        const member = teamList.find(member => member.id === id);
        if (!member) {
            console.error('Member not found');
            return;
        }
        try {
            await axios.put(`/api/users/updateQuota/${id}`, {memberQuota: member.memberQuota});
            alert('Quota updated successfully!');
            // Réinitialisation de l'ID modifié après la sauvegarde réussie
            setModifiedIds(prev => ({...prev, [id]: false}));
            // Vérifier si l'ID du membre mis à jour correspond à l'ID de l'utilisateur connecté
            if (userInfo && userInfo.id === member.id) {
                const updatedUserInfo = {
                    ...userInfo,
                    memberQuota: member.memberQuota // Mise à jour du quota dans UserInfo
                };
                setUserInfo(updatedUserInfo);
            }

        } catch (error) {
            console.error('Failed to update quota', error);
        }
    };
    const revertChanges = () => {
        fetchTeamList(userInfo.teamId, jwt);
        setModifiedIds({});
    };

    function getDaysPerWeek(schedule) {
        const scheduleDays = {
            "FULL_TIME": 5,
            "FOUR_FIFTHS": 4,
            "HALF_TIME": 2.5
        };
        return scheduleDays[schedule] || 0;
    }

    return (
        <div className="main">
            <h2>Edit Member Quotas</h2>
            <div className="edit-parameters">
                <table>
                    <thead>
                    <tr>
                        <th>Lastname</th>
                        <th>Firstname</th>
                        <th>Work Plan</th>
                        <th>Homeworking</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {teamList.map(member => (
                        <tr key={member.id}>
                            <td>{member.lastname}</td>
                            <td>{member.firstname}</td>
                            <td>{getDaysPerWeek(member.workSchedule)}</td>
                            <td>
                                <input
                                    className={modifiedIds[member.id] ? "modified-input" : ""}
                                    type="number"
                                    value={member.memberQuota}
                                    onChange={(e) => handleQuotaChange(member.id, e.target.value)}
                                    min="1"
                                    max={getDaysPerWeek(member.workSchedule)}
                                    step="0.5"
                                />
                            </td>
                            <td>
                                <div className="button-group">
                                    <button className="btn-primary" onClick={() => saveQuota(member.id)}>Save</button>

                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <button className="btn-info" onClick={revertChanges}>Reset</button>

        </div>
    )
}