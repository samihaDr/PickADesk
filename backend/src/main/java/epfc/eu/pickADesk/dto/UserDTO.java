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
    private List<ReservationDTO> reservationList;
    private Integer teamId;
    private Role role;
    private Boolean locked;
    private Boolean enabled;


    public UserDTO(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.lastname = user.getLastname();
        this.firstname = user.getFirstname();
        this.reservationList = user.getReservationList().stream()
                .map(ReservationDTO::fromEntity)
                .collect(Collectors.toList());
        this.teamId = user.getTeamId();
        this.role = user.getRole();
        this.enabled = user.getEnabled();
        this.locked = user.getLocked();
    }
}

