package epfc.eu.pickADesk.reservation;

import epfc.eu.pickADesk.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    @Autowired
    public ReservationService(ReservationRepository reservationRepository, UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
    }

    public List<Reservation> getReservations(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("L'ID est obligatoire.");
        }
        //retourne la liste des reservations de cet utilisateur
        List<Reservation> listReservations = reservationRepository.findByUserId(userId);
        System.out.println("LA TAILLE DE MA LISTE EST " + listReservations.size());
        if (listReservations.isEmpty()) {
            throw new IllegalArgumentException("Vous n'avez pas de reservations ");
        }

        return listReservations;
    }

    public Reservation addReservation(Reservation reservation) {
        // verifier si la date de réservation est valide
        validateReservationDate(reservation);
        reservation.setUser(userRepository.findByEmail("sam@test.com").get());

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
