package epfc.eu.pickADesk.user;

import lombok.Getter;

@Getter
public enum WorkSchedule {
    FULL_TIME(5),
    HALF_TIME(2.5),
    FOUR_FIFTHS(4);

    private final double daysPerWeek;

    WorkSchedule(double daysPerWeek) {
        this.daysPerWeek = daysPerWeek;
    }

}
