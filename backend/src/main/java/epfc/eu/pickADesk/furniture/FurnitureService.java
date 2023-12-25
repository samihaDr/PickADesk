package epfc.eu.pickADesk.furniture;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FurnitureService {
    private final FurnitureRepository furnitureRepository;

    public FurnitureService(FurnitureRepository furnitureRepository) {
        this.furnitureRepository = furnitureRepository;
    }

    public List<Furniture> getEquipment() {
        return furnitureRepository.findAll();
    }
}
