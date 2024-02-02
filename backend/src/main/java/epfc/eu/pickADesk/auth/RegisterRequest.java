package epfc.eu.pickADesk.auth;

import lombok.*;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class RegisterRequest {
    private String email;
    private String lastname;
    private String firstname;
    private String password;
    private Integer teamId;


}
