package epfc.eu.pickADesk.workStation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public interface WorkStationRepository extends JpaRepository<WorkStation, Long> {
    @NonNull
    Optional<WorkStation> findById(Long workStationId);
    @NonNull
    List<WorkStation> findAll();

    @Query("SELECT DISTINCT ws FROM WorkStation ws WHERE ws.active = true " +
            "AND (:workAreaId IS NULL OR ws.workArea.id = :workAreaId) " +
            "AND (:screenId IS NULL OR ws.screen.id = :screenId) " +
            "AND NOT EXISTS (SELECT 1 FROM Equipment e WHERE e.id IN :equipmentIds AND e NOT MEMBER OF ws.equipments) " +
            "AND NOT EXISTS (SELECT 1 FROM Furniture f WHERE f.id IN :furnitureIds AND f NOT MEMBER OF ws.furnitures) " +
            "AND NOT EXISTS (SELECT r FROM Reservation r WHERE r.workStation = ws AND r.reservationDate = :reservationDate " +
            "AND ((:morning = true AND r.morning = true) OR (:afternoon = true AND r.afternoon = true)))")
    Page<WorkStation> findWorkStationsWithOptionalCriteria(
                                                           @Param("workAreaId") Integer workAreaId,
                                                           @Param("screenId") Integer screenId,
                                                           @Param("equipmentIds") List<Integer> equipmentIds,
                                                           @Param("furnitureIds") List<Integer> furnitureIds,
                                                           @Param("reservationDate") LocalDate reservationDate,
                                                           @Param("morning") Boolean morning,
                                                           @Param("afternoon") Boolean afternoon,
                                                           Pageable pageable);
}


