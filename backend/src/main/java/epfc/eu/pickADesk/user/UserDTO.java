package epfc.eu.pickADesk.user;

import epfc.eu.pickADesk.reservation.Reservation;
import lombok.*;

import java.util.List;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String lastname;
    private String firstname;
    private List<Reservation> reservationList;
    private Integer teamId;
    private Role role;
    private Boolean locked;
    private Boolean enabled;



    public UserDTO(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.lastname = user.getLastname();
        this.firstname = user.getFirstname();
        this.reservationList = user.getReservationList();
        this.teamId = user.getTeamId();
        this.role = user.getRole();
        this.enabled = user.getEnabled();
        this.locked = user.getLocked();
    }
}

