package epfc.eu.pickADesk.auth;

import epfc.eu.pickADesk.auth.utils.PasswordValidator;
import epfc.eu.pickADesk.config.JwtService;
import epfc.eu.pickADesk.user.Role;
import epfc.eu.pickADesk.user.User;
import epfc.eu.pickADesk.user.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@AllArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        var password = request.getPassword();
        if (!PasswordValidator.isValidPassword(password)) {
            throw new IllegalArgumentException("Invalid password");
//            return AuthenticationResponse.builder()
//                    .token(null)
//                    .build();
        }
        var user = User.builder()
                .firstname(StringUtils.capitalize(request.getFirstname()))
                .lastname(StringUtils.capitalize(request.getLastname()))
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .locked(false)
                .enabled(true)
                .build();
        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));
        var user = userRepository.findOneByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public ResponseEntity<?> getUserConnected() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(principal instanceof UserDetails) {
            return new ResponseEntity<>(((UserDetails) principal).getUsername(), HttpStatus.OK);
        }
        return new ResponseEntity<>("User is not connected", HttpStatus.FORBIDDEN);
    }
}

