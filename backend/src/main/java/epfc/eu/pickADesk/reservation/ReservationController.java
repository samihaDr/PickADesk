package epfc.eu.pickADesk.reservation;

import epfc.eu.pickADesk.dto.ReservationDTO;
import epfc.eu.pickADesk.utils.ApiResponse;
import epfc.eu.pickADesk.utils.WeekReservationsResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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
    public ResponseEntity<List<ReservationDTO>> getReservations(@RequestParam String filter) {
        List<ReservationDTO> reservations = reservationService.getReservationsByFilter(filter);
        return new ResponseEntity<>(reservations, HttpStatus.OK);
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/pastReservationsLastThreeMonths")
    public ResponseEntity<List<ReservationDTO>> getPastReservationsLastThreeMonths() {
        List<ReservationDTO> pastReservations = reservationService.findPastReservationsLastThreeMonths();
        return ResponseEntity.ok(pastReservations);
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/nextMonthReservations")
    public ResponseEntity<List<ReservationDTO>> getNextMonthReservations() {
        List<ReservationDTO> pastReservations = reservationService.findNextMonthReservations();
        return ResponseEntity.ok(pastReservations);
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

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping(value = "/employeeHasReservationToday/{employeeId}")
    public ApiResponse EmployeeHasReservationToday(@PathVariable Long employeeId) {
        try {
            List<ReservationDTO> results = reservationService.EmployeeHasReservationToday(employeeId);
            if (results.isEmpty()) {
                return new ApiResponse(false, "No reservations for today", null);
            }

            return new ApiResponse(true, "You have reservations for today", results);
        } catch (Exception e) {
            return new ApiResponse(false, "Error checking reservations", e.getMessage());
        }
    }

//    @SecurityRequirement(name = "bearerAuth")
//    @GetMapping(value = "/employeeHasReservationThisWeek/{employeeId}")
//    public ApiResponse EmployeeHasReservationThisWeek(@PathVariable Long employeeId) {
//        try {
//            List<ReservationDTO> results = reservationService.EmployeeHasReservationThisWeek(employeeId);
//            if (results.isEmpty()) {
//                return new ApiResponse(false, "No reservations for this week", null);
//            }
//
//            return new ApiResponse(true, "You have reservations for this week", results);
//        } catch (Exception e) {
//            return new ApiResponse(false, "Error checking reservations", e.getMessage());
//        }
//    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping(value = "/getReservationsForWeek/{userId}")
    public WeekReservationsResponse getReservationsForWeek(@PathVariable Long userId) {
        try {
            List<ReservationDTO> results = reservationService.getReservationsForWeek(userId);
            if (results.isEmpty()) {
                return new WeekReservationsResponse(null, 0.0, false, "No reservations for this week");
            }

            double memberQuota = reservationService.getMemberQuota(userId);
            return new WeekReservationsResponse(results, memberQuota, true, "You have reservations for this week");
        } catch (Exception e) {
            return new WeekReservationsResponse(null, 0.0, false, "Error checking reservations: " + e.getMessage());
        }
    }
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping(value = "/hasReservationTomorrow")
    public ApiResponse hasReservationTomorrow() {
        try {
            List<ReservationDTO> results = reservationService.hasReservationTomorrow();
            if (results.isEmpty()) {
                return new ApiResponse(false, "No reservations for tomorrow", null);
            }

            return new ApiResponse(true, "You have reservations for tomorrow", results);
        } catch (Exception e) {
            return new ApiResponse(false, "Error checking reservations", e.getMessage());
        }
    }

    @GetMapping(value = "/checkReservation/{userId}/{reservationDate}")
    public ResponseEntity<Boolean> checkReservation(
            @PathVariable("userId") Long userId,
            @PathVariable("reservationDate") LocalDate reservationDate,
            @RequestParam(value = "morning", required = false, defaultValue = "false") Boolean morning,
            @RequestParam(value = "afternoon", required = false, defaultValue = "false") Boolean afternoon) {

        boolean exists = reservationService.isExistingReservation(userId, reservationDate, morning, afternoon);
        return ResponseEntity.ok(exists);
    }


    @SecurityRequirement(name = "bearerAuth")
    @GetMapping(value = "checkSelectFavoriteIsAvailable/{workStationId}/{reservationDate}")
    public ResponseEntity<Boolean> checkSelectFavoriteIsAvailable(@PathVariable("workStationId") Long workStationId, @PathVariable("reservationDate") LocalDate reservationDate, @RequestParam(value = "morning", required = false, defaultValue = "false") Boolean morning,
                                                                  @RequestParam(value = "afternoon", required = false, defaultValue = "false") Boolean afternoon) {

        boolean available = reservationService.isWorkStationUnavailable(workStationId, reservationDate, morning, afternoon);
        return ResponseEntity.ok(available);
    }

    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping(value = "/deleteReservation/{reservationId}")
    public ResponseEntity<ApiResponse> deleteReservation(@PathVariable("reservationId") Long reservationId) {
        try {
            reservationService.deleteReservation(reservationId);
            return ResponseEntity.ok(new ApiResponse(true, "Reservation successfully deleted.", null));
        } catch (Exception e) {
            // En cas d'erreur, renvoyer une réponse avec le message d'erreur
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Error deleting reservation: " + e.getMessage(), null));
        }
    }
}
