package epfc.eu.pickADesk.reservation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    @Autowired
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping(value = "/myReservations")
    public ResponseEntity<List<Reservation>> getReservations() {

        return new ResponseEntity<>(reservationService.getReservations(1L), HttpStatus.OK);
    }

    @PostMapping(value = "/addReservation")
    public ResponseEntity<Reservation> addReservation(@RequestBody Reservation reservation) {
        // s'assurer que le champ "id" est nul, car il devrait être généré automatiquement

        // validez et traiter les données de réservation si nécessaire

        // appeler le service pour ajouter la réservation
        return ResponseEntity.ok(reservationService.addReservation(reservation));
    }

    @DeleteMapping(value = "/deleteReservation/{reservationId}")
    public ResponseEntity<Reservation> deleteReservation(@PathVariable("reservationId") Long reservationId) {
        reservationService.deleteReservation(reservationId);
        return ResponseEntity.noContent().build();
    }


}
