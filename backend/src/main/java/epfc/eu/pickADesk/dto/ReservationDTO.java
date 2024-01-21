package epfc.eu.pickADesk.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class ReservationDTO {
    private Long id;
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "UTC")
    private String reservationDate;
    private Integer nbTimeSlot;
    private Integer workStationId;
    private UserDTO userId;
    private Integer reservationTypeId;
}
