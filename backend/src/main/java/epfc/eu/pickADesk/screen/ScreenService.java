package epfc.eu.pickADesk.screen;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScreenService {
    private final ScreenRepository screenRepository;

    public ScreenService(ScreenRepository screenRepository) {
        this.screenRepository = screenRepository;
    }

    public List<Screen> getScreen() {
        return screenRepository.findAll();
    }
}
