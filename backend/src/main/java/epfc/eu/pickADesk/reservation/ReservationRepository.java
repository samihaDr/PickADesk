package epfc.eu.pickADesk.reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;


public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserId(Long userId);

    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId AND r.reservationDate = :date AND (r.morning = TRUE OR r.afternoon = TRUE)")
    List<Reservation> findReservationsForTodayWithFlexibleTiming(@Param("userId") Long userId, @Param("date") LocalDate date);

}
