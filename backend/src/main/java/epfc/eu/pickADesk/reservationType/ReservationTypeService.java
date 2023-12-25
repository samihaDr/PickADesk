package epfc.eu.pickADesk.reservationType;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationTypeService {
    private final ReservationTypeRepository reservationTypeRepository;

    public ReservationTypeService(ReservationTypeRepository reservationTypeRepository) {
        this.reservationTypeRepository = reservationTypeRepository;
    }

    public List<ReservationType> getAllReservationType() {
        return reservationTypeRepository.findAll();
    }
}
