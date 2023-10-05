package epfc.eu.pickADesk.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
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
}
