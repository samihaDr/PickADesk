package epfc.eu.pickADesk.dto;

import epfc.eu.pickADesk.country.Country;
import lombok.Data;

@Data
public class CountryDTO {
    private Integer id;
    private String name;

    public static CountryDTO fromEntity(Country country) {
        CountryDTO dto = new CountryDTO();
        dto.setId(country.getId());
        dto.setName(country.getName());
        return dto;
    }
}
