package epfc.eu.pickADesk.dto;

import epfc.eu.pickADesk.reservation.Reservation;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDTO {
    private Long id;
    private LocalDate reservationDate;
    private Boolean morning;
    private Boolean afternoon;
    private WorkStationDTO workStation;
    private Long userId;
    private Integer reservationTypeId;

    // Méthode pour convertir l'entité en DTO
    public static ReservationDTO fromEntity(Reservation reservation) {
        if (reservation == null) {
            return null;
        }

        return new ReservationDTO(
                reservation.getId(),
                reservation.getReservationDate(),
                reservation.getMorning(),
                reservation.getAfternoon(),
                reservation.getWorkStation() != null ? WorkStationDTO.fromEntity(reservation.getWorkStation()) : null,
                reservation.getUser() != null ? reservation.getUser().getId() : null,
                reservation.getReservationTypeId()
        );
    }
}