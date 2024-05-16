package epfc.eu.pickADesk.user;

import epfc.eu.pickADesk.dto.BasicUserDTO;
import epfc.eu.pickADesk.dto.UserDTO;
import epfc.eu.pickADesk.dto.UserQuotaUpdateDTO;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    public ResponseEntity<List<BasicUserDTO>> getUsers() {
//
        List<BasicUserDTO> users = userService.getUsers();
        return ResponseEntity.ok(users); // Retourne directement la liste des UserDTO
    }

    @GetMapping("/userConnected")
    public ResponseEntity<UserDTO> getUserConnected() {
        UserDTO userDTO = userService.getUserConnected();
        return ResponseEntity.ok(userDTO); // Retourne le UserDTO de l'utilisateur connecté
    }

    @GetMapping("/userRole")
    public ResponseEntity<Boolean> isManager() {
        boolean isManager = userService.isManager(); // Utilisation sans Principal directement
        return ResponseEntity.ok(isManager); // Retourne le rôle de l'utilisateur
    }

    @GetMapping("findColleague/{employeeId}")
    public ResponseEntity<UserDTO> findColleague( @PathVariable Long employeeId) {
        UserDTO userDto = userService.getEmployeeInfo(employeeId);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("getTeamList/{teamId}")
    public ResponseEntity<List<BasicUserDTO>> getTeamList(@PathVariable Integer teamId) {
        List<BasicUserDTO> teamList = userService.getTeamList(teamId);
        return ResponseEntity.ok(teamList);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/updateQuota/{userId}")
    public ResponseEntity<UserQuotaUpdateDTO> updateMemberQuota(@PathVariable Long userId, @RequestBody UserQuotaUpdateDTO userQuotaUpdateDTO) {
        UserQuotaUpdateDTO updatedUser = userService.updateUserQuota(userId, userQuotaUpdateDTO);
        return ResponseEntity.ok(updatedUser);
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        logoutService.logout(request, response, authentication);
        return ResponseEntity.accepted().build();
    }

    @PatchMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ResponseEntity.ok().build();
    }
}
