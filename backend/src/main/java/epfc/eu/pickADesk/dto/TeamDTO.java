package epfc.eu.pickADesk.dto;

import epfc.eu.pickADesk.team.Team;
import lombok.Data;

@Data
public class TeamDTO {
    private Integer id;
    private String name;
    private DepartmentDTO department;
    private double teamQuotaMax;
    private double teamQuotaMin;

    public static TeamDTO fromEntity(Team team) {
        TeamDTO dto = new TeamDTO();
        dto.setId(team.getId());
        dto.setName(team.getName());
        dto.setDepartment(DepartmentDTO.fromEntity(team.getDepartment()));
        dto.setTeamQuotaMax(team.getTeamQuotaMax());
        dto.setTeamQuotaMin(team.getTeamQuotaMin());
        return dto;
    }


}
