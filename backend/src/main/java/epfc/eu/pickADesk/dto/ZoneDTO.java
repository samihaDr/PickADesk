package epfc.eu.pickADesk.dto;

import epfc.eu.pickADesk.zone.Zone;
import lombok.Data;

@Data
public class ZoneDTO {
    private Integer id;
    private String name;

    public static ZoneDTO fromEntity(Zone zone) {
        ZoneDTO dto = new ZoneDTO();
        dto.setId(zone.getId());
        dto.setName(zone.getName());
        return dto;
    }
}
