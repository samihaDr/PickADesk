package epfc.eu.pickADesk.reservationType;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/reservationTypes")
public class ReservationTypeController {
    private final ReservationTypeService reservationTypeService;

    public ReservationTypeController(ReservationTypeService reservationTypeService) {
        this.reservationTypeService = reservationTypeService;
    }

    @GetMapping()
    public ResponseEntity<?> getReservationType() {
        return new ResponseEntity<>(reservationTypeService.getAllReservationType(), HttpStatus.OK);
    }

}
