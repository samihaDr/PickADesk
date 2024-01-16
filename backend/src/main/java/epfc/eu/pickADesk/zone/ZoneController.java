package epfc.eu.pickADesk.zone;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/zones")
public class ZoneController {
    private final ZoneService zoneService;

    public ZoneController(ZoneService zoneService) {
        this.zoneService = zoneService;
    }

    @GetMapping("/getZones/{officeId}")
    public ResponseEntity<List<Zone>> getZonesByOfficeId(@PathVariable Integer officeId) {
        return new ResponseEntity<>(zoneService.getZonesByOfficeId(officeId), HttpStatus.OK);
    }

    @GetMapping("/getZones")
    public ResponseEntity<List<Zone>> getZones() {
        return new ResponseEntity<>(zoneService.getZones(), HttpStatus.OK);
    }
}
