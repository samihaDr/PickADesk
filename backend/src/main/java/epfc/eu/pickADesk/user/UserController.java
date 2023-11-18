package epfc.eu.pickADesk.user;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@SecurityRequirement(name = "bearerAuth")
@RequestMapping("/api/users")
//@Hidden
public class UserController {

    private final UserService userService;
    private final LogoutService logoutService;

    @Autowired
    public UserController(UserService userService, LogoutService logoutService) {
        this.userService = userService;
        this.logoutService = logoutService;
    }


    @GetMapping
    public ResponseEntity<?> getUsers(Principal principal) {
        if (!this.userService.isAdmin(principal)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(userService.getUsers(), HttpStatus.OK);
    }

    @GetMapping("/userConnected")
    public UserDTO getUserConnected(Principal principal) {
        return userService.getUserConnected(principal);
    }

    @GetMapping("/userRole")
    public Boolean isAdmin(Principal principal) {
        return userService.isAdmin(principal);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        logoutService.logout(request, response, authentication);
        return ResponseEntity.accepted().build();
    }
}
