package epfc.eu.pickADesk.workStation;

import epfc.eu.pickADesk.equipment.Equipment;
import epfc.eu.pickADesk.furniture.Furniture;
import epfc.eu.pickADesk.reservationType.ReservationType;
import epfc.eu.pickADesk.screen.Screen;
import epfc.eu.pickADesk.workArea.WorkArea;
import epfc.eu.pickADesk.zone.Zone;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class WorkStation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
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
            name = "work_station_equipment_ids",
            joinColumns = @JoinColumn(name = "work_station_id"),
            inverseJoinColumns = @JoinColumn(name = "equipment_id")
    )
    private List<Equipment> equipments;

    @ManyToMany
    @JoinTable(
            name = "work_station_furniture_ids",
            joinColumns = @JoinColumn(name = "work_station_id"),
            inverseJoinColumns = @JoinColumn(name = "furniture_id")
    )
    private List<Furniture> furnitures;

    @Enumerated(EnumType.STRING)
    private Status status;
}
