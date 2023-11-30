package epfc.eu.pickADesk.team;

import com.fasterxml.jackson.annotation.JsonBackReference;
import epfc.eu.pickADesk.department.Department;
import jakarta.persistence.*;
import lombok.*;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id") // Cette colonne stocke la clé étrangère pour le team associé à cet utilisateur.
    @JsonBackReference
    private Department department;
    public double memberQuota;
    private double teamQuotaMax;
    private double teamQuotaMin;

}
