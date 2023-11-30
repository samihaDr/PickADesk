package epfc.eu.pickADesk.team;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Integer> {
    @NonNull
    List<Team> findTeamsByDepartmentId(Integer department_id);
}
