package epfc.eu.pickADesk.dto;

import epfc.eu.pickADesk.userPreference.UserPreference;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data

public class UserPreferenceDTO {
    private Long id;
    private Long userId;
    private CountryDTO country;
    private CityDTO city;
    private OfficeDTO office;
    private ZoneDTO zone;
    private ReservationTypeDTO reservationType;
    private WorkAreaDTO workArea;
    private ScreenDTO screen;
    private List<EquipmentDTO> equipment;
    private List<FurnitureDTO> furniture;

    public static UserPreferenceDTO fromEntity(UserPreference userPreference) {
        UserPreferenceDTO dto = new UserPreferenceDTO();
        dto.setId(userPreference.getId());
        dto.setUserId(userPreference.getUserId());
        dto.setCountry(CountryDTO.fromEntity(userPreference.getCountry()));
        dto.setCity(CityDTO.fromEntity(userPreference.getCity()));
        dto.setOffice(OfficeDTO.fromEntity(userPreference.getOffice()));
        dto.setZone(ZoneDTO.fromEntity(userPreference.getZone()));
        dto.setReservationType(ReservationTypeDTO.fromEntity(userPreference.getReservationType()));
        dto.setWorkArea(WorkAreaDTO.fromEntity(userPreference.getWorkArea()));
        dto.setScreen(ScreenDTO.fromEntity(userPreference.getScreen()));
        dto.setEquipment(userPreference.getEquipment().stream().map(EquipmentDTO::fromEntity).collect(Collectors.toList()));
        dto.setFurniture(userPreference.getFurniture().stream().map(FurnitureDTO::fromEntity).collect(Collectors.toList()));

        return dto;
    }
}
