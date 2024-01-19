package epfc.eu.pickADesk.workStation;

import epfc.eu.pickADesk.dto.WorkStationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class WorkStationService {
    private final WorkStationRepository workStationRepository;

    @Autowired
    public WorkStationService(WorkStationRepository workStationRepository) {
        this.workStationRepository = workStationRepository;
    }

    public Optional<WorkStationDTO> getWorkStationById(Long id) {
        return workStationRepository.findById(id).map(WorkStationDTO::fromEntity);
    }

    public List<WorkStationDTO> getAllWorkStations() {
        return workStationRepository.findAll().stream()
                .map(WorkStationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public Page<WorkStationDTO> findWorkStationsWithOptionalCriteria(Integer zoneId,
                                                                     Integer reservationTypeId,
                                                                     Integer workAreaId,
                                                                     Integer screenId,
                                                                     List<Integer> equipmentIds,
                                                                     List<Integer> furnitureIds,
                                                                     Pageable pageable) {
        Page<WorkStation> page = workStationRepository.findWorkStationsWithOptionalCriteria(zoneId, reservationTypeId, workAreaId, screenId, equipmentIds, furnitureIds, pageable);
        return page.map(WorkStationDTO::fromEntity);
    }

}
