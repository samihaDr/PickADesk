package epfc.eu.pickADesk.reservation;

import epfc.eu.pickADesk.user.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring", uses = UserMapper.class)
public interface ReservationMapper {
    ReservationMapper INSTANCE = Mappers.getMapper(ReservationMapper.class);
    ReservationDTO reservationToReservationDTO(Reservation reservation);

    List<ReservationDTO> reservationListToReservationDTOList(List<Reservation> reservationList);

    Reservation reservationDTOToReservation(ReservationDTO reservationDTO);
}
