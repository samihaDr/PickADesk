package epfc.eu.pickADesk.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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

    public void changePassword(ChangePasswordRequest request, Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        //check if the current password is correct
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Wrong password");
        }
        // check if the two new passwords are the same
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalArgumentException("Passwords are not the same");
        }
        //Update the password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        //save the new password
        userRepository.save(user);
    }
}
