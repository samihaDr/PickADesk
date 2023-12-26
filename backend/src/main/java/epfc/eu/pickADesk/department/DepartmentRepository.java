package epfc.eu.pickADesk.department;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DepartmentRepository extends JpaRepository<Department, Integer> {

    @Query("SELECT t.department FROM Team t WHERE t.id = :teamId")
    Department findDepartmentByTeamId(Integer teamId);
}
