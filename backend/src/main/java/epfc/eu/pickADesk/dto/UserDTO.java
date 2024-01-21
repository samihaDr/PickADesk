package epfc.eu.pickADesk.dto;

import epfc.eu.pickADesk.reservation.Reservation;
import epfc.eu.pickADesk.user.Role;
import epfc.eu.pickADesk.user.User;
import lombok.*;

import java.util.List;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
//@Getter
//@Setter
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

//    public static UserDTO fromEntity(User user) {
//        UserDTO dto = new UserDTO();
//        dto.setId(user.getId());
//        dto.setEmail(user.getEmail());
//        dto.setLastname(user.getLastname());
//        dto.setFirstname(user.getFirstname());
//        dto.setRole(user.getRole());
//        dto.setTeamId(user.getTeamId());
//        dto.setEnabled(user.getEnabled());
//        dto.setLocked(user.getLocked());
//        return dto;
//    }


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

