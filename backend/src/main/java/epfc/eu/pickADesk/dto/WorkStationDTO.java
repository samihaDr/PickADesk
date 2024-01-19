package epfc.eu.pickADesk.dto;

import epfc.eu.pickADesk.workStation.WorkStation;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class WorkStationDTO {
    private Long id;
    private ZoneDTO zone;
    private ReservationTypeDTO reservationType;
    private WorkAreaDTO workArea;
    private ScreenDTO screen;
    private List<EquipmentDTO> equipments;
    private List<FurnitureDTO> furnitures;
    private String status; // Assuming Status is an enum or string

    // Conversion method from entity to DTO
    public static WorkStationDTO fromEntity(WorkStation workStation) {
        WorkStationDTO dto = new WorkStationDTO();
        dto.setId(workStation.getId());
        dto.setZone(ZoneDTO.fromEntity(workStation.getZone()));
        dto.setReservationType(ReservationTypeDTO.fromEntity(workStation.getReservationType()));
        dto.setWorkArea(WorkAreaDTO.fromEntity(workStation.getWorkArea()));
        dto.setScreen(ScreenDTO.fromEntity(workStation.getScreen()));
        dto.setEquipments(workStation.getEquipments().stream().map(EquipmentDTO::fromEntity).collect(Collectors.toList()));
        dto.setFurnitures(workStation.getFurnitures().stream().map(FurnitureDTO::fromEntity).collect(Collectors.toList()));
        dto.setStatus(workStation.getStatus().toString());
        return dto;
    }
}
