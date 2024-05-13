package epfc.eu.pickADesk.user;

import epfc.eu.pickADesk.dto.UserDTO;
import epfc.eu.pickADesk.reservation.ReservationMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.Optional;

@Mapper(componentModel = "spring", uses = ReservationMapper.class)
public interface UserMapper {
//    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

   // UserDTO userToUserDTO(Optional<User> user);

//   @Mapping(target = "password", ignore = true) // Assurez-vous que le mot de passe n'est pas inclus
    UserDTO userToUserDTO(User user);

    @Mapping(target = "id", source = "id") // N'ignorez pas l'id si vous voulez supporter les mises à jour
    User userDTOToUser(UserDTO userDTO);

    List<UserDTO> userListToUserDTOList(List<User> userList);


}

