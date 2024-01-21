package epfc.eu.pickADesk.dto;

import epfc.eu.pickADesk.furniture.Furniture;
import lombok.Data;

@Data
public class FurnitureDTO {
    private Integer id;
    private String name;
    // Conversion method from entity to DTO
    public static FurnitureDTO fromEntity(Furniture furniture) {
        FurnitureDTO dto = new FurnitureDTO();
        dto.setId(furniture.getId());
        dto.setName(furniture.getName());
        return dto;
    }
}
