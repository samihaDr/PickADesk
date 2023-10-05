package epfc.eu.pickADesk.reservation;

import epfc.eu.pickADesk.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;
    private final UserService userService;

    @Autowired
    public ReservationController(ReservationService reservationService, UserService userService) {
        this.reservationService = reservationService;
        this.userService = userService;
    }

    @GetMapping(value = "/myReservations")
    public ResponseEntity<List<Reservation>> getReservations(Principal principal) {
        // Réccuperer l'Id de l'utilisateur connecté
        Long userConnectedId = this.userService.getUserConnected(principal);
        System.out.println("USER CONNECTED ========== " + userConnectedId);
        return new ResponseEntity<>(reservationService.getReservations(principal), HttpStatus.OK);
    }

    @PostMapping(value = "/addReservation")
    public ResponseEntity<Reservation> addReservation(@RequestBody @Validated Reservation reservation, Principal principal) {
        // Réccuperer l'Id de l'utilisateur connecté
        Long userConnectedId = this.userService.getUserConnected(principal);
        System.out.println("USER CONNECTED ========== " + userConnectedId);
        // s'assurer que le champ "id" est nul, car il devrait être généré automatiquement

        // validez et traiter les données de réservation si nécessaire

        // appeler le service pour ajouter la réservation
        return ResponseEntity.ok(reservationService.addReservation(reservation, principal));
    }

    @DeleteMapping(value = "/deleteReservation/{reservationId}")
    public ResponseEntity<Reservation> deleteReservation(@PathVariable("reservationId") Long reservationId) {
        reservationService.deleteReservation(reservationId);
        return ResponseEntity.noContent().build();
    }


}
