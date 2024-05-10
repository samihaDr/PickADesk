package epfc.eu.pickADesk.reservation;

import epfc.eu.pickADesk.dto.ReservationDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import java.util.Optional;

@Mapper(componentModel = "spring")
public interface ReservationMapper {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "workStation", target = "workStation")
    @Mapping(source = "colleagueId", target = "colleagueId", qualifiedByName = "optionalToLong")
    ReservationDTO reservationToReservationDTO(Reservation reservation);

    @Mapping(target = "user", ignore = true) // Ignorez si la création de l'entité User à partir de l'ID n'est pas simple
    @Mapping(target = "workStation", ignore = true) // De même pour WorkStation
    @Mapping(source = "colleagueId", target = "colleagueId", qualifiedByName = "longToOptional")
    Reservation reservationDTOToReservation(ReservationDTO reservationDTO);

    // Méthodes pour gérer Optional
    @Named("longToOptional")
    default Optional<Long> longToOptional(Long value) {
        return Optional.ofNullable(value);
    }

    @Named("optionalToLong")
    default Long optionalToLong(Optional<Long> value) {
        return value.orElse(null);
    }
}
