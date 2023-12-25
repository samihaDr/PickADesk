package epfc.eu.pickADesk.workArea;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/workArea")
public class WorkAreaController {

    private final WorkAreaService workAreaService;

    public WorkAreaController(WorkAreaService workAreaService) {
        this.workAreaService = workAreaService;
    }
    @GetMapping("/workArea")
    public ResponseEntity<?> getWorkArea() {
        return new ResponseEntity<>(workAreaService.getWorkArea(), HttpStatus.OK);
    }
}
