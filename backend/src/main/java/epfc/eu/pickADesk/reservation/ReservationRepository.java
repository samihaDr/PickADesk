package epfc.eu.pickADesk.reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Optional<Reservation> findByUserIdAndReservationDate(Long userId, LocalDate reservationDate);

    List<Reservation> findByUserIdAndReservationDateBetween(Long userId, LocalDate start, LocalDate end);

    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId AND r.reservationDate = :date AND (r.morning = TRUE OR r.afternoon = TRUE)")
    List<Reservation> findReservationsForTodayWithFlexibleTiming(@Param("userId") Long userId, @Param("date") LocalDate date);


}
