package epfc.eu.pickADesk.user;

import epfc.eu.pickADesk.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDTO getUserConnected() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .map(UserDTO::fromUser) // Utilisez la méthode fromUser pour convertir User en UserDTO
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Boolean isAdmin() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .map(User::getRole)
                .map(Role.ADMIN::equals)
                .orElse(false);
    }

    public List<UserDTO> getUsers() {
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            throw new IllegalArgumentException("Aucun utilisateur dans la liste");
        }
        return users.stream()
                .map(UserDTO::fromUser) // Convertir chaque User en UserDTO
                .collect(Collectors.toList());
    }

    public UserDTO getEmployeeInfo(long employeeId ) {
        return userRepository.findById(employeeId)
                .map(UserDTO::fromUser) // Utilisez la méthode fromUser pour convertir User en UserDTO
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    public void changePassword(ChangePasswordRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Vérifiez si le mot de passe actuel est correct
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Wrong password");
        }
        // Vérifiez si les deux nouveaux mots de passe sont identiques
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalArgumentException("Passwords are not the same");
        }
        // Mettez à jour le mot de passe
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user); // Sauvegardez le nouveau mot de passe
    }
}
