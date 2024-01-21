package epfc.eu.pickADesk.userPreference;

import epfc.eu.pickADesk.city.City;
import epfc.eu.pickADesk.country.Country;
import epfc.eu.pickADesk.equipment.Equipment;
import epfc.eu.pickADesk.furniture.Furniture;
import epfc.eu.pickADesk.office.Office;
import epfc.eu.pickADesk.reservationType.ReservationType;
import epfc.eu.pickADesk.screen.Screen;
import epfc.eu.pickADesk.user.User;
import epfc.eu.pickADesk.workArea.WorkArea;
import epfc.eu.pickADesk.zone.Zone;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class UserPreference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "country_id")
    private Country country;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "city_id")
    private City city;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "office_id")
    private Office office;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "zone_id")
    private Zone zone;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "reservation_type_id")
    private ReservationType reservationType;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "work_area_id")
    private WorkArea workArea;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "screen_id")
    private Screen screen;
    @ManyToMany
    @JoinTable(
            name = "user_preference_equipment_ids",
            joinColumns = @JoinColumn(name = "user_preference_id"),
            inverseJoinColumns = @JoinColumn(name = "equipment_id")
    )
    private List<Equipment> equipment;

    @ManyToMany
    @JoinTable(
            name = "user_preference_furniture_ids",
            joinColumns = @JoinColumn(name = "user_preference_id"),
            inverseJoinColumns = @JoinColumn(name = "furniture_id")
    )
    private List<Furniture> furniture;
}
