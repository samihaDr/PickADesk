package epfc.eu.pickADesk.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Range;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeamQuotaUpdateDTO {
    @NotNull
    private Integer teamId;
    @Range( max = 12,message = "Team quota cannot exceed 12 of the total")
    private Double teamQuotaMax;
    @Range( min = 2,message = "Team quota cannot be less than 2 of the total.")
    private Double teamQuotaMin;
}
