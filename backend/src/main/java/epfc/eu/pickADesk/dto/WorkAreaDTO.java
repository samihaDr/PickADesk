package epfc.eu.pickADesk.dto;

import epfc.eu.pickADesk.workArea.WorkArea;
import lombok.Data;

@Data

public class WorkAreaDTO {
    private Integer id;
    private String name;

    public static WorkAreaDTO fromEntity(WorkArea workArea) {
        WorkAreaDTO dto = new WorkAreaDTO();
        dto.setId(workArea.getId());
        dto.setName(workArea.getName());
        return dto;
    }
}
