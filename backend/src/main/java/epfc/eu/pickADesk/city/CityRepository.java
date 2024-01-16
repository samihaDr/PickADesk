package epfc.eu.pickADesk.city;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CityRepository extends JpaRepository<City, Integer> {
    List<City> findCitiesByCountryId(Integer country);

    List<City> findAll();
}
