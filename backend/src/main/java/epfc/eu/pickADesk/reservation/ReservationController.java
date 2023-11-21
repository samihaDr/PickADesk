package epfc.eu.pickADesk.reservation;

import epfc.eu.pickADesk.utils.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

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

    @GetMapping(value = "hasReservationToday")
    public ApiResponse hasReservationToday(Principal principal) {
        ApiResponse response;
        if (principal == null) {
            return new ApiResponse(false);
        }

        Optional<Reservation> result = reservationService.hasReservationToday(principal);
        if (result.isEmpty()) {
            response = new ApiResponse(false,"You don't have any reservations for today",result);
        } else {
            response = new ApiResponse(true,"Success message",result);
        }

        return response;
        
    }

    @DeleteMapping(value = "/deleteReservation/{reservationId}")
    public ResponseEntity<Reservation> deleteReservation(@PathVariable("reservationId") Long reservationId) {
        reservationService.deleteReservation(reservationId);
        return ResponseEntity.noContent().build();
    }


}
