package epfc.eu.pickADesk.city;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import epfc.eu.pickADesk.country.Country;
import epfc.eu.pickADesk.office.Office;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity

public class City {
    @OneToMany(mappedBy = "city", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private final List<Office> officeList = new ArrayList<>();
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id") // Cette colonne stocke la clé étrangère pour le pays associé à cette ville.
    @JsonBackReference
    private Country country;
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "UTC")
    private LocalDate localDate;


}

