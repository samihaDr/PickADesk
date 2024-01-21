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
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

//    @Mapping(target = "password", ignore = true)
    UserDTO userToUserDTO(Optional<User> user);

    @Mapping(target = "id", ignore = true)
    User userDTOToUser(UserDTO userDTO);

    List<UserDTO> userListToUserDTOList(List<User> userList);
    default UserDTO map(User value) {
        return userToUserDTO(Optional.ofNullable(value));
    }

}
