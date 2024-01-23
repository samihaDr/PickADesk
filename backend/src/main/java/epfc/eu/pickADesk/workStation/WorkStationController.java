package epfc.eu.pickADesk.workStation;

import epfc.eu.pickADesk.dto.WorkStationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/workStations")
public class WorkStationController {
    private final WorkStationService workStationService;

    @Autowired
    public WorkStationController(WorkStationService workStationService) {
        this.workStationService = workStationService;
    }

    @GetMapping("/{workStationId}")
    public ResponseEntity<WorkStationDTO> getWorkStationById(@PathVariable Long workStationId) {
        Optional<WorkStationDTO> workStationDTO = workStationService.getWorkStationById(workStationId);
        return workStationDTO.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/all")
    public ResponseEntity<List<WorkStationDTO>> getAllWorkStations() {
        List<WorkStationDTO> workStations = workStationService.getAllWorkStations();
        return ResponseEntity.ok(workStations);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<WorkStationDTO>> searchWorkStations(
            @RequestParam(required = false) Integer zoneId,
            @RequestParam(required = false) Integer reservationTypeId,
            @RequestParam(required = false) Integer workAreaId,
            @RequestParam(required = false) Integer screenId,
            @RequestParam(required = false) List<Integer> equipmentIds,
            @RequestParam(required = false) List<Integer> furnitureIds,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String order) {

        PageRequest pageable = PageRequest.of(page, size, Sort.Direction.fromString(order), sortBy);
        Page<WorkStationDTO> workStationPage = workStationService.findWorkStationsWithOptionalCriteria(
                zoneId, reservationTypeId, workAreaId, screenId, equipmentIds, furnitureIds, pageable);

        return ResponseEntity.ok(workStationPage);
    }

}
