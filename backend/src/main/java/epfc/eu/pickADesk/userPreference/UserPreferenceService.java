package epfc.eu.pickADesk.userPreference;

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

    public Optional<UserPreference> getUserPreference(Long userId) {
        return userPreferenceRepository.findByUserId(userId);
    }

    public UserPreference saveUserPreference(UserPreference userPreference) {
        // Supposons que userPreference contient un identifiant d'utilisateur
        Long userId = userPreference.getUserId();

        // Rechercher les préférences existantes pour cet utilisateur
        Optional<UserPreference> existingPreference = userPreferenceRepository.findByUserId(userId);

        if (existingPreference.isPresent()) {
            // Si des préférences existent, les mettre à jour
            UserPreference updatedPreference = existingPreference.get();
            // Mettre à jour les champs de updatedPreference avec ceux de userPreference
            updatedPreference.setCityId(userPreference.getCityId());
            updatedPreference.setCountryId(userPreference.getCountryId());
            updatedPreference.setOfficeId(userPreference.getOfficeId());
            updatedPreference.setZoneId(userPreference.getZoneId());
            updatedPreference.setReservationTypeId(userPreference.getReservationTypeId());
            updatedPreference.setWorkAreaId(userPreference.getWorkAreaId());
            updatedPreference.setScreenId(userPreference.getScreenId());
            updatedPreference.setEquipmentIds(userPreference.getEquipmentIds());
            updatedPreference.setFurnitureIds(userPreference.getFurnitureIds());

            // Sauvegarder les préférences mises à jour
            return userPreferenceRepository.save(updatedPreference);
        } else {
            // Si aucune préférence n'existe, enregistrer les nouvelles préférences
            return userPreferenceRepository.save(userPreference);
        }
    }

    public UserPreference addUserEquipments(Long userId, List<Integer> equipments) {
        Optional<UserPreference> userPreferenceOptional = userPreferenceRepository.findByUserId(userId);
        if (userPreferenceOptional.isPresent()) {
            UserPreference userPreference = userPreferenceOptional.get();
            userPreference.getEquipmentIds().addAll(equipments);
            return userPreferenceRepository.save(userPreference);
        }
        return null;
    }

    public UserPreference addUserFurnitures(Long userId, List<Integer> furnitureIds) {
        Optional<UserPreference> userPreferenceOptional = userPreferenceRepository.findByUserId(userId);
        if (userPreferenceOptional.isPresent()) {
            UserPreference userPreference = userPreferenceOptional.get();
            userPreference.getFurnitureIds().addAll(furnitureIds);
            return userPreferenceRepository.save(userPreference);
        }
        return null;
    }

}
