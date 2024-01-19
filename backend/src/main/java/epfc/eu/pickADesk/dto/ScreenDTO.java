package epfc.eu.pickADesk.dto;

import epfc.eu.pickADesk.screen.Screen;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScreenDTO {
    private Integer id;
    private String name;

    public static ScreenDTO fromEntity(Screen screen) {
        ScreenDTO dto = new ScreenDTO();
        dto.setId(screen.getId());
        dto.setName(screen.getName());
        return dto;
    }
}
