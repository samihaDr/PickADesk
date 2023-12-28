package epfc.eu.pickADesk.zone;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ZoneRepository extends JpaRepository<Zone, Integer> {
    List<Zone> findZonesByOfficeId(Integer officeId);
}
