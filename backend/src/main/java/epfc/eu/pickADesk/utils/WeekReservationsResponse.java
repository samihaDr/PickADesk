package epfc.eu.pickADesk.utils;

import epfc.eu.pickADesk.dto.ReservationDTO;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WeekReservationsResponse {
    private List<ReservationDTO> reservations;
    private double memberQuota;
    private boolean success;
    private String message;
}
