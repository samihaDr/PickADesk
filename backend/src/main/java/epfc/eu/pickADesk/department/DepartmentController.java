package epfc.eu.pickADesk.department;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {
    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping("/allDepartments")
    public ResponseEntity<?> getAllDepartments() {
        return new ResponseEntity<>(departmentService.getAllDepartments(), HttpStatus.OK);
    }

    @GetMapping("/getDepartment/{teamId}")
    public ResponseEntity<?> getDepartment(@PathVariable Integer teamId) {
        return new ResponseEntity<>(departmentService.getDepartment(teamId), HttpStatus.OK);
    }
}
