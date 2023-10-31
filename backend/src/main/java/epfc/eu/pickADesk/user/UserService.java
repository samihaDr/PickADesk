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

    public Long getUserConnected(Principal principal) {
        if (!(principal instanceof UsernamePasswordAuthenticationToken userPrincipal)) {
            throw new RuntimeException("User not found");
        }
        Optional<User> userConnected = userRepository.findOneByEmail(userPrincipal.getName());
        return userConnected.map(User::getId).orElse(null);
    }

    public Boolean getUserConnectedRole(Principal principal) {
        if (!(principal instanceof UsernamePasswordAuthenticationToken userPrincipal)) {
            throw new RuntimeException("User not found");
        }

        return userRepository.findOneByEmail(userPrincipal.getName())
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
