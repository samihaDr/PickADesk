package epfc.eu.pickADesk.reservation;

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
    private LocalDate date;
    private Integer nbTimeSlot;
    private Integer workStationId;

    @ManyToOne(fetch = FetchType.LAZY)
    //@JoinColumn(name = "userId") // Cette colonne stocke la clé étrangère pour l'utilisateur associé à cette réservation.
    private User user;
    private Integer reservationTypeId;
}
