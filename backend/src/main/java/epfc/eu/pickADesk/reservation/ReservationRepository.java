package epfc.eu.pickADesk.reservation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    //Optional<Reservation> findById(Long reservationId);
    List<Reservation> findByUserId(Long userId);
}
