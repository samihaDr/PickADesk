package epfc.eu.pickADesk.reservation;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import epfc.eu.pickADesk.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "UTC")
    private LocalDate reservationDate;
    private Integer nbTimeSlot;
    private Integer workStationId;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    // Cette colonne stocke la clé étrangère pour l'utilisateur associé à cette réservation.
    @JsonBackReference
    private User user;
    private Integer reservationTypeId;
}
