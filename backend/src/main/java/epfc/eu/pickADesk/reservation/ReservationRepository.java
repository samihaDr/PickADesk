package epfc.eu.pickADesk.reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Optional<Reservation> findByUserIdAndReservationDateAndMorning(Long userId, LocalDate reservationDate, Boolean morning);

    Optional<Reservation> findByUserIdAndReservationDateAndAfternoon(Long userId, LocalDate reservationDate, Boolean afternoon);

    Optional<Reservation> findByUserIdAndReservationDateAndMorningAndAfternoon(Long userId, LocalDate reservationDate, Boolean morning, Boolean afternoon);

    List<Reservation> findByUserIdAndReservationDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId AND r.reservationDate = :date AND (r.morning = TRUE OR r.afternoon = TRUE)")
    List<Reservation> findReservationsForTodayWithFlexibleTiming(@Param("userId") Long userId, @Param("date") LocalDate date);

    Optional<Reservation> findByUserIdAndReservationDate(Long userId, LocalDate reservationDate);

    Optional<Reservation> findByWorkStationIdAndReservationDateAndMorning(Long workstationId, LocalDate reservationDate, Boolean morning);
    Optional<Reservation> findByWorkStationIdAndReservationDateAndAfternoon(Long workstationId, LocalDate reservationDate, Boolean afternoon);

}
