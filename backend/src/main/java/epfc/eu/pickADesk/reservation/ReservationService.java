package epfc.eu.pickADesk.reservation;

import epfc.eu.pickADesk.user.User;
import epfc.eu.pickADesk.user.UserDTO;
import epfc.eu.pickADesk.user.UserRepository;
import epfc.eu.pickADesk.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Autowired
    public ReservationService(ReservationRepository reservationRepository, UserService userService, UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.userService = userService;
        this.userRepository = userRepository;
    }


    public List<Reservation> getReservations(Principal principal) {
        UserDTO userConnected = this.userService.getUserConnected(principal);
        System.out.println("USER CONNECTED SERVICE ========== " + userConnected.getEmail());
        //retourne la liste des reservations de cet utilisateur
        List<Reservation> listReservations = reservationRepository.findByUserId(userConnected.getId());
        System.out.println("LA TAILLE DE MA LISTE EST " + listReservations.size());
        if (listReservations.isEmpty()) {
            throw new IllegalArgumentException("Vous n'avez pas de reservations ");
        }
        return listReservations;
    }

    public Reservation addReservation(Reservation reservation, Principal principal) {
        UserDTO userConnected = this.userService.getUserConnected(principal);
        User userConnectedId = this.userRepository.findOneById(userConnected.getId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userConnected.getEmail()));
        validateReservationDate(reservation);
        reservation.setUser(userConnectedId);
        return reservationRepository.save(reservation);
    }


    public void validateReservationDate(Reservation reservation) {
        LocalDate today = LocalDate.now();
        LocalDate onMonthLater = today.plusMonths(1);

        if (reservation.getReservationDate() == null) {
            throw new IllegalArgumentException("La date de réservation est requise.");
        }

        if (reservation.getReservationDate().isBefore(today)) {
            throw new IllegalArgumentException("La date de réservation ne peut être antérieure .");
        }
        if (reservation.getReservationDate().isAfter(onMonthLater)) {
            throw new IllegalArgumentException("La date de réservation ne peut être ultérieure à un mois ");
        }
    }

    public void deleteReservation(Long reservationId) {
        //Long userConnectedId = this.userService.getUserConnected(principal);
        if (reservationId == null) {
            throw new IllegalArgumentException("L'ID de réservation doit être spécifié lors de la suppression.");
        }

        Optional<Reservation> reservationToDelete = reservationRepository.findById(reservationId);

        if (reservationToDelete.isEmpty()) {
            throw new IllegalArgumentException("Aucune réservation ne correspond à cet id");
        }

        reservationRepository.delete(reservationToDelete.get());
    }
}
