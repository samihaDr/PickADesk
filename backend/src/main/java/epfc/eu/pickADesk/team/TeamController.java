package epfc.eu.pickADesk.team;

import epfc.eu.pickADesk.dto.TeamQuotaUpdateDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/teams")
public class TeamController {
    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping("/allTeamsByDepartment/{departmentId}")
    public ResponseEntity<?> getAllTeamsByDepartment(@PathVariable Integer departmentId) {
        return new ResponseEntity<>(teamService.getTeamsByDepartment(departmentId), HttpStatus.OK);
    }

    @GetMapping("/getTeamById/{teamId}")
    public ResponseEntity<Team> getTeamById(@PathVariable Integer teamId) {
        return new ResponseEntity<>(teamService.getTeamById(teamId), HttpStatus.OK);
    }

    @GetMapping("/getAllTeams")
    public ResponseEntity<?> getAllTeams() {
        return new ResponseEntity<>(teamService.getAllTeams(), HttpStatus.OK);
    }
    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/updateQuota/{teamId}")
    public ResponseEntity<TeamQuotaUpdateDTO> updateTeamQuota(@PathVariable Integer teamId, @RequestBody TeamQuotaUpdateDTO teamQuotaUpdateDTO) {
       TeamQuotaUpdateDTO updatedTeam = teamService.updateTeamQuota(teamId, teamQuotaUpdateDTO);
       return ResponseEntity.ok(updatedTeam);
    }
}
