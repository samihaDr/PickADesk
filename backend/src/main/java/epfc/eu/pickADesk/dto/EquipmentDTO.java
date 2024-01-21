package epfc.eu.pickADesk.dto;

import epfc.eu.pickADesk.equipment.Equipment;
import lombok.Data;

@Data
public class EquipmentDTO {
    private Integer id;
    private String name;

    // Conversion method from entity to DTO
    public static EquipmentDTO fromEntity(Equipment equipment) {
        EquipmentDTO dto = new EquipmentDTO();
        dto.setId(equipment.getId());
        dto.setName(equipment.getName());
        return dto;
    }
}
