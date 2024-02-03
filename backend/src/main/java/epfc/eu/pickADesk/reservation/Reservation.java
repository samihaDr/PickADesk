package epfc.eu.pickADesk.reservation;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import epfc.eu.pickADesk.user.User;
import epfc.eu.pickADesk.workStation.WorkStation;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(
        name = "reservation",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"reservation_date", "work_station_id", "morning"}),
                @UniqueConstraint(columnNames = {"reservation_date", "work_station_id", "afternoon"})
        }
)
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "reservation_date", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "UTC")
    private LocalDate reservationDate;

    private Boolean morning;
    private Boolean afternoon;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_station_id", nullable = false)
    private WorkStation workStation;


    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    // Cette colonne stocke la clé étrangère pour l'utilisateur associé à cette réservation.
    @JsonBackReference
    private User user;

    private Integer reservationTypeId;
}