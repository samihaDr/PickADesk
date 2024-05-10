// import axios from 'axios';
//
// export function useEmployeeWeeklyReservations(jwt) {
//     async function employeeWeeklyReservations(employeeId) {
//         try {
//             const url = `/api/reservations/getReservationsForWeek/${employeeId}`;
//             const response = await axios.get(url, {
//                 headers: { Authorization: `Bearer ${jwt}` },
//             });
//             let totalDaysReserved = 0;
//             if (response.data.reservations) {
//                 response.data.reservations.forEach((reservation) => {
//                     totalDaysReserved += reservation.morning && reservation.afternoon ? 1 : 0.5;
//                 });
//             }
//             return totalDaysReserved;
//         } catch (error) {
//             console.error("Erreur lors de la récupération des réservations hebdomadaires :", error);
//             return 0;
//
//         }
//     }
//
//     return { employeeWeeklyReservations };
// }
