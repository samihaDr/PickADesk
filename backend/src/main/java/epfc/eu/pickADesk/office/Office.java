package epfc.eu.pickADesk.office;

import com.fasterxml.jackson.annotation.JsonBackReference;
import epfc.eu.pickADesk.city.City;
import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
public class Office {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id") // Cette colonne stocke la clé étrangère pour le pays associé à cette ville.
    @JsonBackReference
    private City city;

}
