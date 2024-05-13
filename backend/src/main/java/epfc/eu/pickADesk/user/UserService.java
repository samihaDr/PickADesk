package epfc.eu.pickADesk.user;

import epfc.eu.pickADesk.dto.UserDTO;
import epfc.eu.pickADesk.exceptions.UserNotFoundException;
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
    private final UserMapper userMapper;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    public UserDTO getUserConnected() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
        return userMapper.userToUserDTO(user);
    }

    public Boolean isManager() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .map(User::getRole)
                .map(Role.MANAGER::equals)
                .orElse(false);
    }

//    public List<UserDTO> getUsers() {
//        List<User> users = userRepository.findAll();
//        if (users.isEmpty()) {
//            throw new IllegalArgumentException("Aucun utilisateur dans la liste");
//        }
//        return users.stream()
//                .map(UserDTO::fromUser) // Convertir chaque User en UserDTO
//                .collect(Collectors.toList());
//    }

    public List<UserDTO> getUsers() {
        List<User> users = userRepository.findAll();
        return userMapper.userListToUserDTOList(users);
    }


    public UserDTO getEmployeeInfo(long employeeId) {
        User user = userRepository.findById(employeeId)
                .orElseThrow(() -> new UserNotFoundException("Employee not found with ID: " + employeeId));
        return userMapper.userToUserDTO(user);
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

    public List<UserDTO> getTeamList(Integer teamId) {
        List<User> teamList = userRepository.findUsersByTeamId(teamId);
        if (teamList.isEmpty()) {
            throw new IllegalArgumentException("Aucun utilisateur dans la liste");
        }
        return teamList.stream()
                .map(UserDTO::fromUser) // Convertir chaque User en UserDTO
                .collect(Collectors.toList());
    }
}
