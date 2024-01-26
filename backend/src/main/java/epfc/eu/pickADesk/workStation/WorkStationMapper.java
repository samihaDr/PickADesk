package epfc.eu.pickADesk.workStation;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import epfc.eu.pickADesk.dto.WorkStationDTO;

@Mapper(componentModel = "spring")
public interface WorkStationMapper {

    WorkStationMapper INSTANCE = Mappers.getMapper(WorkStationMapper.class);

    // Méthode pour convertir de l'entité WorkStation au DTO
    WorkStationDTO workStationToWorkStationDTO(WorkStation workStation);

    // Méthode pour convertir du DTO WorkStation à l'entité
    WorkStation workStationDTOToWorkStation(WorkStationDTO workStationDTO);
}
