package epfc.eu.pickADesk.dto;

import epfc.eu.pickADesk.user.WorkSchedule;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Range;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserQuotaUpdateDTO {
    @NotNull(message = "User ID is required")
    private Long id;
    private String firstname;
    private String lastname;

    @NotNull(message = "Work schedule is required")
    private WorkSchedule workSchedule;

    @Range(min = 1, max = 5, message = "Member quota must be between 1 and 5")
    private Double memberQuota;
}
