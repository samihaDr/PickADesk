package epfc.eu.pickADesk.team;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamService {
    private final TeamRepository teamRepository;

    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    //recuperer la liste des teams
    public List<Team> getTeamsByDepartment(Integer departmentId) {
        return teamRepository.findTeamsByDepartmentId(departmentId);
    }

    public Team getTeamById(Integer teamId) {
        return teamRepository.findTeamById(teamId);
    }
}
