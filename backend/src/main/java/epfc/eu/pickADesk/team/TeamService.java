package epfc.eu.pickADesk.team;

import epfc.eu.pickADesk.dto.TeamQuotaUpdateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TeamService {
    private final TeamRepository teamRepository;

    @Autowired
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

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    @Transactional
    public TeamQuotaUpdateDTO updateTeamQuota(Integer teamId, TeamQuotaUpdateDTO quotaUpdateDTO) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        team.setTeamQuotaMax(quotaUpdateDTO.getTeamQuotaMax());
        team.setTeamQuotaMin(quotaUpdateDTO.getTeamQuotaMin());

        teamRepository.save(team);
        return quotaUpdateDTO;
    }
}
