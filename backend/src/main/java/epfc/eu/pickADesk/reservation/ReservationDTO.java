package epfc.eu.pickADesk.reservation;

import com.fasterxml.jackson.annotation.JsonFormat;
import epfc.eu.pickADesk.user.UserDTO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReservationDTO {
    private Long id;
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "UTC")
    private String reservationDate;
    private Integer nbTimeSlot;
    private Integer workStationId;
    private UserDTO userId;
    private Integer reservationTypeId;
}
