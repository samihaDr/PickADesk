
import { useState } from 'react';
import axios from 'axios';

export function useTeamList() {
    const [teamList, setTeamList] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchTeamList(teamId, jwt) {
        setLoading(true);
        try {
            const response = await axios.get(`/api/users/getTeamList/${teamId}`, {
                headers: {Authorization: `Bearer ${jwt}`},
            });
            if (Array.isArray(response.data)) {
                const sortedData = response.data.sort((a, b) =>
                    a.lastname.localeCompare(b.lastname),
                );

                setTeamList(sortedData);
                setLoading(false);
                return response.data;  // Retourner les données pour une utilisation immédiate
            } else {
                throw new Error("Data is not an array");
            }
        } catch (error) {
            console.error("Fetch team list error:", error);
            setError("Unable to load the list of employees: " + error.message);
            setLoading(false);
            return [];  // Retourner un tableau vide en cas d'erreur
        }
    }

    return {teamList, setTeamList,isLoading, error, fetchTeamList};
}