package epfc.eu.pickADesk.dto;

import epfc.eu.pickADesk.office.Office;
import lombok.Data;

@Data
public class OfficeDTO {
    private Integer id;
    private String name;

    public static OfficeDTO fromEntity(Office office) {
        OfficeDTO dto = new OfficeDTO();
        dto.setId(office.getId());
        dto.setName(office.getName());
        return dto;
    }

}