package epfc.eu.pickADesk.city;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CityService {
    private final CityRepository cityRepository;

    public CityService(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    public List<City> getCitiesByCountry(Integer countryId) {
        return cityRepository.findCitiesByCountryId(countryId);
    }
}
