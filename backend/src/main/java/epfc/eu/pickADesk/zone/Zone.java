package epfc.eu.pickADesk.zone;

import com.fasterxml.jackson.annotation.JsonBackReference;
import epfc.eu.pickADesk.office.Office;
import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Zone {
    @Id@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "office_id")
    @JsonBackReference
    private Office office;
}
