package epfc.eu.pickADesk.dto;

import epfc.eu.pickADesk.city.City;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
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
