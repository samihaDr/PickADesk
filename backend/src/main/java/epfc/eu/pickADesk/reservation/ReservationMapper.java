package epfc.eu.pickADesk.reservation;

import epfc.eu.pickADesk.dto.ReservationDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReservationMapper {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "workStation", target = "workStation")
    ReservationDTO reservationToReservationDTO(Reservation reservation);

    @Mapping(target = "user", ignore = true) // Ignorez si la création de l'entité User à partir de l'ID n'est pas simple
    @Mapping(target = "workStation", ignore = true) // De même pour WorkStation
    Reservation reservationDTOToReservation(ReservationDTO reservationDTO);
}

