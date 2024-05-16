package epfc.eu.pickADesk.user;

import epfc.eu.pickADesk.dto.BasicUserDTO;
import epfc.eu.pickADesk.dto.UserDTO;
import epfc.eu.pickADesk.dto.UserQuotaUpdateDTO;
import epfc.eu.pickADesk.reservation.ReservationMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.Optional;

@Mapper(componentModel = "spring", uses = ReservationMapper.class)
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserDTO userToUserDTO(Optional<User> user);
    @Mapping(target = "id", ignore = true)
    User userDTOToUser(UserDTO userDTO);
    UserDTO userToUserDTO(User user);
    List<UserDTO> userListToUserDTOList(List<User> userList);

    //  mappings for UserQuotaUpdateDTO
    @Mapping(source = "memberQuota", target = "memberQuota")
    @Mapping(source = "workSchedule", target = "workSchedule")
    UserQuotaUpdateDTO userToUserQuotaUpdateDTO(User user);

    @Mapping(target = "memberQuota", source = "memberQuota")
    @Mapping(target = "workSchedule", source = "workSchedule")
    User userQuotaUpdateDTOToUser(UserQuotaUpdateDTO userQuotaUpdateDTO);

    // mapping for BasicUserDTO
//    @Mapping(target = "teamId", source = "team.id")
    BasicUserDTO userToBasicUserDTO(User user);

//    @Mapping(target = "team.id", source = "teamId")
    User basicUserDTOToUser(BasicUserDTO basicUserDTO);
}
