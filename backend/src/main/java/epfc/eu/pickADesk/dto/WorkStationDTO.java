package epfc.eu.pickADesk.dto;

import epfc.eu.pickADesk.workStation.WorkStation;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class WorkStationDTO {
    private Long id;
    private String workPlace;
    private ZoneDTO zone;
    private ReservationTypeDTO reservationType;
    private WorkAreaDTO workArea;
    private ScreenDTO screen;
    private List<EquipmentDTO> equipments;
    private List<FurnitureDTO> furnitures;
    private Boolean active;

    // Conversion method from entity to DTO
    public static WorkStationDTO fromEntity(WorkStation workStation) {
        WorkStationDTO dto = new WorkStationDTO();
        dto.setId(workStation.getId());
        dto.setWorkPlace(workStation.getWorkPlace());
        dto.setZone(ZoneDTO.fromEntity(workStation.getZone()));
        dto.setWorkArea(WorkAreaDTO.fromEntity(workStation.getWorkArea()));
        dto.setScreen(ScreenDTO.fromEntity(workStation.getScreen()));
        dto.setEquipments(workStation.getEquipments().stream().map(EquipmentDTO::fromEntity).collect(Collectors.toList()));
        dto.setFurnitures(workStation.getFurnitures().stream().map(FurnitureDTO::fromEntity).collect(Collectors.toList()));
        dto.setActive(workStation.getActive());
        return dto;
    }
}
