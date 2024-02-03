package epfc.eu.pickADesk.dto;

import epfc.eu.pickADesk.user.Role;
import epfc.eu.pickADesk.user.User;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class UserDTO {
    private Long id;
    private String email;
    private String lastname;
    private String firstname;
    private List<ReservationDTO> reservations;
    private Integer teamId;
    private Role role;
    private Boolean locked;
    private Boolean enabled;


    // Constructeur supplémentaire pour créer un UserDTO à partir d'un User
    public static UserDTO fromUser(User user) {
        if (user == null) {
            return null;
        }

        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .lastname(user.getLastname())
                .firstname(user.getFirstname())
                .reservations(user.getReservations().stream()
                        .map(ReservationDTO::fromEntity)
                        .collect(Collectors.toList()))
                .teamId(user.getTeamId())
                .role(user.getRole())
                .locked(user.getLocked())
                .enabled(user.getEnabled())
                .build();
    }
}

