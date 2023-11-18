package epfc.eu.pickADesk.auth;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface RegisterRequestMapper {
    RegisterRequestMapper INSTANCE = Mappers.getMapper(RegisterRequestMapper.class);

    @Mapping(source = "email", target = "email")
    @Mapping(source = "lastname", target = "lastname")
    @Mapping(source = "firstname", target = "firstname")
    @Mapping(source = "password", target = "password")
    RegisterRequest toRegisterRequest(RegisterRequestDTO dto);

}
