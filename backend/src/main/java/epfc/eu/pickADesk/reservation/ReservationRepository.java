package epfc.eu.pickADesk.reservation;

import org.springframework.data.jpa.repository.JpaRepository;


public interface ReservationRepository extends JpaRepository<Reservation, Integer> {
    //List<Reservation> findByUserId(Integer userId);
}
