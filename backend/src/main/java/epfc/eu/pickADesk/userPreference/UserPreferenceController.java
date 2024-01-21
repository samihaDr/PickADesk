package epfc.eu.pickADesk.userPreference;

import epfc.eu.pickADesk.dto.UserPreferenceDTO;
import epfc.eu.pickADesk.equipment.Equipment;
import epfc.eu.pickADesk.furniture.Furniture;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/userPreferences")
public class UserPreferenceController {
    private final UserPreferenceService userPreferenceService;

    @Autowired
    public UserPreferenceController(UserPreferenceService userPreferenceService) {
        this.userPreferenceService = userPreferenceService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserPreferenceDTO> getUserPreferences(@PathVariable Long userId) {
        Optional<UserPreferenceDTO> userPreferenceDTO = userPreferenceService.getUserPreference(userId);
        return userPreferenceDTO.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping ("/addPreferences")
    public ResponseEntity<UserPreferenceDTO> saveUserPreferences(@RequestBody UserPreference userPreference) {
        Optional<UserPreferenceDTO> userPreferenceDTO = userPreferenceService.saveUserPreference(userPreference);
        return userPreferenceDTO.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{userId}/addEquipments")
    public ResponseEntity<UserPreferenceDTO> addUserEquipments(@PathVariable Long userId, @RequestBody List<Equipment> equipment) {
        Optional<UserPreferenceDTO> userPreferenceDTO = userPreferenceService.addUserEquipments(userId, equipment);
        return userPreferenceDTO.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{userId}/addFurnitures")
    public ResponseEntity<UserPreferenceDTO> addUserFurnitures(@PathVariable Long userId, @RequestBody List<Furniture> furniture) {
        Optional<UserPreferenceDTO> userPreferenceDTO = userPreferenceService.addUserFurnitures(userId, furniture);
        return userPreferenceDTO.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}

