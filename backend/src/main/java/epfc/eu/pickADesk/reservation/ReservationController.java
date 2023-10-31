package epfc.eu.pickADesk.reservation;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    @Autowired
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping(value = "/myReservations")
    public ResponseEntity<List<Reservation>> getReservations(Principal principal) {
        return new ResponseEntity<>(reservationService.getReservations(principal), HttpStatus.OK);
    }

    @PostMapping(value = "/addReservation")
    public ResponseEntity<Reservation> addReservation(@RequestBody @Validated Reservation reservation, Principal principal) {
        return ResponseEntity.ok(reservationService.addReservation(reservation, principal));
    }

    @DeleteMapping(value = "/deleteReservation/{reservationId}")
    public ResponseEntity<Reservation> deleteReservation(@PathVariable("reservationId") Long reservationId) {
        reservationService.deleteReservation(reservationId);
        return ResponseEntity.noContent().build();
    }


}
