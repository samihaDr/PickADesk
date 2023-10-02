package epfc.eu.pickADesk.reservation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;

    @Autowired
    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    public Reservation addReservation(Reservation reservation) {
        // verifier si la date de réservation est valide
        validateReservationDate(reservation);

        return reservationRepository.save(reservation);
    }

    public void validateReservationDate(Reservation reservation) {
        LocalDate today = LocalDate.now();
        LocalDate onMonthLater = today.plusMonths(1);

        if (reservation.getDate() == null) {
            throw new IllegalArgumentException("La date de réservation est requise.");
        }

        if (reservation.getDate().isBefore(today)) {
            throw new IllegalArgumentException("La date de réservation ne peut être antérieure .");
        }
        if (reservation.getDate().isAfter(onMonthLater)) {
            throw new IllegalArgumentException("La date de réservation ne peut être ultérieure à un mois ");
        }
    }
}
