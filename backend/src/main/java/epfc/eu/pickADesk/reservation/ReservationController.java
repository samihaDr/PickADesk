package epfc.eu.pickADesk.reservation;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {


    @GetMapping(value="/myReservations")
    public ResponseEntity<List<Reservation>> listReservations() {
        Reservation reservation1 = new Reservation();
        reservation1.setDate(LocalDate.of(2023, 10, 12));
        reservation1.setReservationTypeId(1);
        reservation1.setNbTimeSlot(1);
        reservation1.setWorkStationId(1);
        reservation1.setReservationTypeId(1);
        //reservation1.setUser(User user);
        Reservation reservation2 = new Reservation();
        reservation2.setDate(LocalDate.of(2023, 10, 14));
        reservation2.setReservationTypeId(2);
        reservation2.setNbTimeSlot(2);
        reservation2.setWorkStationId(2);
        reservation2.setReservationTypeId(2);

        return new ResponseEntity<>(List.of(reservation1, reservation2), HttpStatus.OK);
    }


}
