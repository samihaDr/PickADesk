package epfc.eu.pickADesk.reservation;

import epfc.eu.pickADesk.dto.ReservationDTO;
import epfc.eu.pickADesk.utils.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping(value = "/myReservations")
    public ResponseEntity<List<ReservationDTO>> getReservations() {
        List<ReservationDTO> reservations = reservationService.getReservations();
        return new ResponseEntity<>(reservations, HttpStatus.OK);
    }

    @PostMapping(value = "/addReservation")
    public ResponseEntity<ReservationDTO> addReservation(@RequestBody @Validated ReservationDTO reservationDTO) {
        ReservationDTO addedReservation = reservationService.addReservation(reservationDTO);
        return ResponseEntity.ok(addedReservation);
    }

    @GetMapping(value = "/hasReservationToday")
    public ApiResponse hasReservationToday() {
        try {
            List<ReservationDTO> results = reservationService.hasReservationToday();
            if (results.isEmpty()) {
                return new ApiResponse(false, "No reservations for today", null);
            }

            return new ApiResponse(true, "You have reservations for today", results);
        } catch (Exception e) {
            return new ApiResponse(false, "Error checking reservations", e.getMessage());
        }
    }

    @DeleteMapping(value = "/deleteReservation/{reservationId}")
    public ResponseEntity<?> deleteReservation(@PathVariable("reservationId") Long reservationId) {
        reservationService.deleteReservation(reservationId);
        return ResponseEntity.noContent().build();
    }
}
