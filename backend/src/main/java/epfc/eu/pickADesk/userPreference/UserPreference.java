package epfc.eu.pickADesk.userPreference;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserPreference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Integer countryId;
    private Integer cityId;
    private Integer officeId;
    private Integer zoneId;
    private Integer reservationTypeId;
    private Integer workAreaId;
    @ElementCollection
    private List<Integer> equipmentIds;
    private Integer screenId;
    @ElementCollection
    private List<Integer> furnitureIds;
}
