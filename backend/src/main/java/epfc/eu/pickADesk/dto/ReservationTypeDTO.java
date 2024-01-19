package epfc.eu.pickADesk.dto;

import epfc.eu.pickADesk.reservationType.ReservationType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class ReservationTypeDTO {
    private Integer id;
    private String name;

    public static ReservationTypeDTO fromEntity(ReservationType reservationType) {
        ReservationTypeDTO dto = new ReservationTypeDTO();
        dto.setId(reservationType.getId());
        dto.setName(reservationType.getName());
        return dto;
    }

}
