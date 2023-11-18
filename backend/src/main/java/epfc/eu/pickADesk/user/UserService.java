package epfc.eu.pickADesk.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDTO getUserConnected(Principal principal) {
        if (!(principal instanceof UsernamePasswordAuthenticationToken userPrincipal)) {
            throw new RuntimeException("User not found");
        }
        Optional<User> userConnected = userRepository.findByEmail(userPrincipal.getName());
        return userConnected.map(UserDTO::new).orElse(null);
    }

    public Boolean isAdmin(Principal principal) {
        if (!(principal instanceof UsernamePasswordAuthenticationToken userPrincipal)) {
            throw new RuntimeException("User not found");
        }

        return userRepository.findByEmail(userPrincipal.getName())
                .map(User::getRole)
                .orElse(Role.USER) == Role.ADMIN;
    }

    public List<User> getUsers() {
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            throw new IllegalArgumentException("Aucun utilisateur dans la liste ");
        }
        return users;
    }

}
