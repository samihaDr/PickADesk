package epfc.eu.pickADesk.reservation;

import epfc.eu.pickADesk.dto.ReservationDTO;
import epfc.eu.pickADesk.utils.ApiResponse;
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
    private ReservationMapper reservationMapper;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping(value = "/myReservations")
    public ResponseEntity<List<ReservationDTO>> getReservations(Principal principal) {
        List<ReservationDTO> reservations = reservationService.getReservations(principal);
        return new ResponseEntity<>(reservations, HttpStatus.OK);
    }

    @PostMapping(value = "/addReservation")
    public ResponseEntity<ReservationDTO> addReservation(@RequestBody @Validated Reservation reservation, Principal principal) {
        Reservation addedReservation = reservationService.addReservation(reservation, principal);
        ReservationDTO reservationDTO = reservationMapper.reservationToReservationDTO(addedReservation);
        return ResponseEntity.ok(reservationDTO);
    }

    @GetMapping(value = "/hasReservationToday")
    public ApiResponse hasReservationToday(Principal principal) {
        try {
            if (principal == null) {
                return new ApiResponse(false, "User is not authenticated", null);
            }

            List<ReservationDTO> results = reservationService.hasReservationToday(principal);
            if (results == null || results.isEmpty()) {
                return new ApiResponse(false, "No reservations for today", null);
            }

            return new ApiResponse(true, "You have reservations for today", results);
        } catch (Exception e) {
            return new ApiResponse(false, "Error checking reservations", null);
        }
    }

    @DeleteMapping(value = "/deleteReservation/{reservationId}")
    public ResponseEntity<?> deleteReservation(@PathVariable("reservationId") Long reservationId) {
        reservationService.deleteReservation(reservationId);
        return ResponseEntity.noContent().build();
    }


}
