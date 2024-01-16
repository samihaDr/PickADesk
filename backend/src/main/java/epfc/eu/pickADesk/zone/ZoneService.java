package epfc.eu.pickADesk.zone;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ZoneService {

    private final ZoneRepository zoneRepository;

    public ZoneService(ZoneRepository zoneRepository) {
        this.zoneRepository = zoneRepository;
    }

    public List<Zone> getZonesByOfficeId(Integer officeId) {
        return zoneRepository.findZonesByOfficeId(officeId);
    }

    public List<Zone> getZones() {
        return zoneRepository.findAll();
    }
}
