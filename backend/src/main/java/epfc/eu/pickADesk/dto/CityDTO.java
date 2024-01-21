package epfc.eu.pickADesk.dto;

import epfc.eu.pickADesk.city.City;
import lombok.Data;

@Data
public class CityDTO {
    private Integer id;
    private String name;

    public static CityDTO fromEntity(City city) {
        CityDTO dto = new CityDTO();
        dto.setId(city.getId());
        dto.setName(city.getName());
        return dto;
    }
}
