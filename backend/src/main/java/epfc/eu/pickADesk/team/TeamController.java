package epfc.eu.pickADesk.team;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping("/allTeamsByDepartment/{departmentId}")
    public ResponseEntity<?> getAllTeamsByDepartment(@PathVariable Integer departmentId){
        return new ResponseEntity<>(teamService.getTeamsByDepartment(departmentId), HttpStatus.OK);
    }
}
