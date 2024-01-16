package epfc.eu.pickADesk.office;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OfficeService {
    private final OfficeRepository officeRepository;

    public OfficeService(OfficeRepository officeRepository) {
        this.officeRepository = officeRepository;
    }

    public List<Office> getOffices() {
        return this.officeRepository.findAll();
    }

    public List<Office> getOfficesByCityId(Integer cityId) {
        return officeRepository.findOfficesByCityId(cityId);
    }
}
