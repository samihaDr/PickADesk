import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FindColleague.scss";

export default function FindColleague() {
  const [employeeList, setEmployeeList] = useState([]);
  const [filteredEmployeeList, setFilteredEmployeeList] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeInfo, setEmployeeInfo] = useState("");
  const [searchPeriod, setSearchPeriod] = useState("today");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Charger la liste des employés au chargement du composant
  useEffect(() => {
    fetchEmployeeList();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filteredAndSorted = employeeList
        .filter((employee) =>
          employee.email.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .sort((a, b) => a.email.localeCompare(b.email));

      setFilteredEmployeeList(filteredAndSorted);
    }, 300); // Applique un délai pour améliorer la performance pendant la frappe

    return () => clearTimeout(timer);
  }, [searchTerm, employeeList]);

  const fetchEmployeeList = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/users");
      const sortedData = response.data.sort((a, b) =>
        a.email.localeCompare(b.email),
      );
      setEmployeeList(sortedData);
      setFilteredEmployeeList(sortedData);
    } catch (error) {
      setError("Impossible de charger la liste des employés.");
    } finally {
      setLoading(false);
    }
  };

  // Mise à jour pour inclure fetchEmployeeInfoAndDesk
  useEffect(() => {
    if (employeeId) fetchEmployeeInfoAndDesk();
  }, [employeeId, searchPeriod]);

  const fetchEmployeeInfoAndDesk = async () => {
    setLoading(true);
    try {
      const infoResponse = await axios.get(
        `/api/users/findColleague/${employeeId}`,
      );
      setEmployeeInfo(infoResponse.data);
      if (searchPeriod === "today") {
        const deskResponse = await axios.get(
          `/api/reservations/employeeHasReservationToday/${employeeId}`,
        );
        setResult(deskResponse.data.data);
      } else {
        const deskResponse = await axios.get(
          `/api/reservations/employeeHasReservationThisWeek/${employeeId}`,
        );
        setResult(deskResponse.data.data);
      }
    } catch (error) {
      setError(
        "Impossible de charger les informations de l'employé ou les réservations.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Assurez-vous que l'ID de l'employé et la période de recherche sont définis avant d'appeler l'API
    if (employeeId && searchPeriod) {
      fetchEmployeeInfoAndDesk();
    }
  }, [employeeId, searchPeriod]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEmployeeSelectionChange = (e) => {
    const selectedId = e.target.value;
    console.log("Selected Employee ID:", selectedId); // Débogage
    setEmployeeId(selectedId);
  };

  const handleSearchPeriodChange = (e) => {
    setSearchPeriod(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("EmployeeSelected :", employeeId);
    if (!employeeId || employeeId === "") {
      alert("Veuillez sélectionner un employé.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="main">
        <h2>Find Colleague</h2>
        <div className="findColleague-container">
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="searchTerm" className="form-label">
                  Search
                </label>
                <input
                  type="text"
                  id="searchTerm"
                  name="searchTerm"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="form-control"
                  placeholder="Search by email..."
                />

                <label htmlFor="employeeId" className="form-label">
                  Employee list
                </label>
                <select
                  id="employeeId"
                  name="employeeId"
                  value={employeeId}
                  onChange={handleEmployeeSelectionChange}
                  className="form-select"
                >
                  {/*<option value="">Select an employee</option>*/}
                  {filteredEmployeeList.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="selection-period">
                <input
                  type="radio"
                  id="today"
                  name="searchPeriod"
                  value="today"
                  checked={searchPeriod === "today"}
                  onChange={handleSearchPeriodChange}
                />
                <label htmlFor="today">Today</label>

                <input
                  type="radio"
                  id="week"
                  name="searchPeriod"
                  value="week"
                  checked={searchPeriod === "week"}
                  onChange={handleSearchPeriodChange}
                />
                <label htmlFor="week">This week</label>
              </div>
              <br />
              {/*<div className="search">*/}
              {/*  <button type="submit" className="btn btn-primary">*/}
              {/*    Search*/}
              {/*  </button>*/}
              {/*</div>*/}
            </form>
          </div>
        </div>

        {result && result.length > 0 ? (
          <div className="result">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Email</th>
                  <th>Zone</th>
                  <th>Seat</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {result.map((reservation, index) => (
                  <tr key={index}>
                    <td>
                      {employeeInfo.lastname + " " + employeeInfo.firstname}
                    </td>
                    <td>{employeeInfo.email}</td>
                    <td>{reservation.workStation.zone.name}</td>
                    <td>{reservation.workStation.workPlace}</td>
                    <td>{reservation.reservationDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>Pas de réservation trouvée pour la période sélectionnée.</div>
        )}
      </div>
    </>
  );
}
