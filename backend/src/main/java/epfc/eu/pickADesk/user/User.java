package epfc.eu.pickADesk.user;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import epfc.eu.pickADesk.reservation.Reservation;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity

public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Email(message = "Invalid email format") // Utilisation de @Email pour la validation d'email
    @NotBlank(message = "Email is required") // @NotBlank implique déjà @NotNull
    private String email;

    @NotBlank(message = "Lastname must be between 3 and 25 characters")
    @Size(min = 3, max = 25)
    private String lastname;

    @NotBlank(message = "Firstname must be between 3 and 25 characters")
    @Size(min = 3, max = 25)
    private String firstname;

    @NotBlank(message = "Password must contain at least 8 characters, including a number and a special character.")
    @Size(min = 8)
    private String password;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Reservation> reservations = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private Role role;

    @NotNull(message = "Team ID is required")
    private Integer teamId;

    private Boolean locked = false;
    private Boolean enabled = false;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !locked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }


}
