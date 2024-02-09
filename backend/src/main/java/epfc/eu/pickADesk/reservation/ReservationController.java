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

@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping(value="/getReservation/{reservationId}")
    public ResponseEntity<ApiResponse> getReservation(@PathVariable Long reservationId) {
        try {
            ReservationDTO reservationDTO = reservationService.findReservationById(reservationId);
            if (reservationDTO != null) {
                // Si la réservation est trouvée, renvoyer les données avec un succès
                return ResponseEntity.ok(new ApiResponse(true, "Reservation found", reservationDTO));
            } else {
                // Si la réservation n'est pas trouvée, renvoyer un message d'erreur
                return ResponseEntity.ok(new ApiResponse(false, "Reservation not found", null));
            }
        } catch (Exception e) {
            // Gérer les exceptions, par exemple, si une erreur inattendue se produit
            return ResponseEntity.ok(new ApiResponse(false, "An error occurred: " + e.getMessage(), null));
        }
    }
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping(value = "/myReservations")
    public ResponseEntity<List<ReservationDTO>> getReservations() {
        List<ReservationDTO> reservations = reservationService.getReservations();
        return new ResponseEntity<>(reservations, HttpStatus.OK);
    }

    @SecurityRequirement(name = "bearerAuth")
    @PostMapping(value = "/addReservation")
    public ResponseEntity<ReservationDTO> addReservation(@RequestBody @Validated ReservationDTO reservationDTO) {
        ReservationDTO addedReservation = reservationService.addReservation(reservationDTO);
        return ResponseEntity.ok(addedReservation);
    }
    @SecurityRequirement(name = "bearerAuth")
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

}
