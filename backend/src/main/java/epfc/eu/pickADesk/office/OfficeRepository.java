package epfc.eu.pickADesk.office;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OfficeRepository extends JpaRepository<Office, Integer> {
    List<Office> findOfficesByCityId(Integer cityId);
}
