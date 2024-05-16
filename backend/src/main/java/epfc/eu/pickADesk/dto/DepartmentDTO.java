package epfc.eu.pickADesk.dto;

import epfc.eu.pickADesk.department.Department;
import lombok.Data;

@Data
public class DepartmentDTO {
    private Integer id;
    private String name;

    public static DepartmentDTO fromEntity(Department department) {
        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(department.getId());
        dto.setName(department.getName());
        return dto;
    }
}
