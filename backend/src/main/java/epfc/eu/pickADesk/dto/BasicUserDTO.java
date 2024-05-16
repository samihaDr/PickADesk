package epfc.eu.pickADesk.dto;

import epfc.eu.pickADesk.user.Role;
import epfc.eu.pickADesk.user.User;
import epfc.eu.pickADesk.user.WorkSchedule;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BasicUserDTO {
    private Long id;
    private String lastname;
    private String firstname;
    private Integer teamId;
    private Role role;
    private WorkSchedule workSchedule;
    private Double memberQuota;

    // Constructeur supplémentaire pour créer un UserDTO à partir d'un User
    public static BasicUserDTO fromUser(User user) {
        if (user == null) {
            return null;
        }

        return BasicUserDTO.builder()
                .id(user.getId())
                .lastname(user.getLastname())
                .firstname(user.getFirstname())
                .teamId(user.getTeamId())
                .role(user.getRole())
                .workSchedule(user.getWorkSchedule())
                .memberQuota(user.getMemberQuota())
                .build();
    }
}
