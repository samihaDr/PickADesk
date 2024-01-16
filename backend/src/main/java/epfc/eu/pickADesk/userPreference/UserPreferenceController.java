package epfc.eu.pickADesk.userPreference;

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
    public ResponseEntity<Optional<UserPreference>> getUserPreferences(@PathVariable Long userId) {
        return  new ResponseEntity<>(userPreferenceService.getUserPreference(userId), HttpStatus.OK);
    }

    @PostMapping ("/addPreferences")
    public ResponseEntity<UserPreference> saveUserPreferences(@RequestBody UserPreference userPreference) {
        return  ResponseEntity.ok(userPreferenceService.saveUserPreference(userPreference));
    }

    @PostMapping("/{userId}/addEquipments")
    public UserPreference addUserEquipments(@PathVariable Long userId, @RequestBody List<Integer> equipmentIds) {
        return userPreferenceService.addUserEquipments(userId, equipmentIds);
    }

    @PostMapping("/{userId}/addFurnitures")
    public UserPreference addUserFurnitures(@PathVariable Long userId, @RequestBody List<Integer> furnitureIds) {
        return userPreferenceService.addUserFurnitures(userId, furnitureIds);
    }

}
