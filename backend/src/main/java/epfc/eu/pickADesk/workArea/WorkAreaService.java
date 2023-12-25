package epfc.eu.pickADesk.workArea;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkAreaService {
    private final WorkAreaRepository workAreaRepository;

    public WorkAreaService(WorkAreaRepository workAreaRepository) {
        this.workAreaRepository = workAreaRepository;
    }

    public List<WorkArea> getWorkArea() {
        return workAreaRepository.findAll();
    }
}
