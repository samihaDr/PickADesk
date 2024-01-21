package epfc.eu.pickADesk.userPreference;

import epfc.eu.pickADesk.dto.UserPreferenceDTO;
import epfc.eu.pickADesk.equipment.Equipment;
import epfc.eu.pickADesk.furniture.Furniture;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserPreferenceService {
    private final UserPreferenceRepository userPreferenceRepository;

    @Autowired
    public UserPreferenceService(UserPreferenceRepository userPreferenceRepository) {
        this.userPreferenceRepository = userPreferenceRepository;
    }

    public Optional<UserPreferenceDTO> getUserPreference(Long userId) {
        return userPreferenceRepository.findByUserId(userId).map(UserPreferenceDTO::fromEntity);
    }

    public Optional<UserPreferenceDTO> saveUserPreference(UserPreference userPreference) {
        // Supposons que userPreference contient un identifiant d'utilisateur
        Long userId = userPreference.getUserId();

        // Rechercher les préférences existantes pour cet utilisateur
        Optional<UserPreference> existingPreference = userPreferenceRepository.findByUserId(userId);

        if (existingPreference.isPresent()) {
            // Si des préférences existent, les mettre à jour
            UserPreference updatedPreference = existingPreference.get();
            // Mettre à jour les champs de updatedPreference avec ceux de userPreference
            updatedPreference.setCity(userPreference.getCity());
            updatedPreference.setCountry(userPreference.getCountry());
            updatedPreference.setOffice(userPreference.getOffice());
            updatedPreference.setZone(userPreference.getZone());
            updatedPreference.setReservationType(userPreference.getReservationType());
            updatedPreference.setWorkArea(userPreference.getWorkArea());
            updatedPreference.setScreen(userPreference.getScreen());
            updatedPreference.setEquipment(userPreference.getEquipment());
            updatedPreference.setFurniture(userPreference.getFurniture());

            // Sauvegarder les préférences mises à jour
            return Optional.of(UserPreferenceDTO.fromEntity(userPreferenceRepository.save(updatedPreference)));
        } else {
            // Si aucune préférence n'existe, enregistrer les nouvelles préférences
            return Optional.of(UserPreferenceDTO.fromEntity(userPreferenceRepository.save(userPreference)));
        }
    }

    public Optional<UserPreferenceDTO> addUserEquipments(Long userId, List<Equipment> equipment) {
        Optional<UserPreference> userPreferenceOptional = userPreferenceRepository.findByUserId(userId);
        if (userPreferenceOptional.isPresent()) {
            UserPreference userPreference = userPreferenceOptional.get();
            userPreference.getEquipment().addAll(equipment);
            return userPreferenceOptional.map(UserPreferenceDTO::fromEntity);
        }
        return Optional.empty();
    }

    public Optional<UserPreferenceDTO> addUserFurnitures(Long userId, List<Furniture> furniture) {
        Optional<UserPreference> userPreferenceOptional = userPreferenceRepository.findByUserId(userId);
        if (userPreferenceOptional.isPresent()) {
            UserPreference userPreference = userPreferenceOptional.get();
            userPreference.getFurniture().addAll(furniture);
            return userPreferenceOptional.map(UserPreferenceDTO::fromEntity);
        }
        return Optional.empty();
    }

}
