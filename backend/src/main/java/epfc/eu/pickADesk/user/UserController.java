package epfc.eu.pickADesk.user;

import epfc.eu.pickADesk.dto.UserDTO;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final LogoutService logoutService;

    @Autowired
    public UserController(UserService userService, LogoutService logoutService) {
        this.userService = userService;
        this.logoutService = logoutService;
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getUsers() {
        if (!userService.isAdmin()) { // Utilisation sans Principal directement
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        List<UserDTO> users = userService.getUsers();
        return ResponseEntity.ok(users); // Retourne directement la liste des UserDTO
    }

    @GetMapping("/userConnected")
    public ResponseEntity<UserDTO> getUserConnected() {
        UserDTO userDTO = userService.getUserConnected();
        return ResponseEntity.ok(userDTO); // Retourne le UserDTO de l'utilisateur connecté
    }

    @GetMapping("/userRole")
    public ResponseEntity<Boolean> isAdmin() {
        boolean isAdmin = userService.isAdmin(); // Utilisation sans Principal directement
        return ResponseEntity.ok(isAdmin); // Retourne le rôle de l'utilisateur
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        logoutService.logout(request, response, authentication);
        return ResponseEntity.accepted().build();
    }

    @PatchMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        userService.changePassword(request); // Modification pour ne pas utiliser Principal directement
        return ResponseEntity.ok().build();
    }
}
