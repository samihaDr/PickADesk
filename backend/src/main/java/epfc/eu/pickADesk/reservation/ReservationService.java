package epfc.eu.pickADesk.reservation;

import epfc.eu.pickADesk.dto.ReservationDTO;
import epfc.eu.pickADesk.user.User;
import epfc.eu.pickADesk.user.UserService;
import epfc.eu.pickADesk.workStation.WorkStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final UserService userService;
    private final ReservationMapper reservationMapper;
    private final WorkStationRepository workStationRepository;

    @Autowired
    public ReservationService(ReservationRepository reservationRepository, UserService userService, ReservationMapper reservationMapper, WorkStationRepository workStationRepository) {
        this.reservationRepository = reservationRepository;
        this.userService = userService;
        this.reservationMapper = reservationMapper;
        this.workStationRepository = workStationRepository;
    }

    public List<ReservationDTO> hasReservationToday() {
        Long userId = this.userService.getUserConnected().getId();
        LocalDate today = LocalDate.now();

        List<Reservation> reservations = this.reservationRepository.findReservationsForTodayWithFlexibleTiming(userId, today);
        return reservations.stream()
                .map(reservationMapper::reservationToReservationDTO)
                .collect(Collectors.toList());
    }

    public List<ReservationDTO> getReservations() {
        Long userId = this.userService.getUserConnected().getId();
        List<Reservation> listReservations = reservationRepository.findByUserId(userId);

        if (listReservations.isEmpty()) {
            throw new IllegalArgumentException("Vous n'avez pas de reservations.");
        }

        return listReservations.stream()
                .map(reservationMapper::reservationToReservationDTO)
                .collect(Collectors.toList());
    }

    public ReservationDTO addReservation(ReservationDTO reservationDTO) {
        Long userId = this.userService.getUserConnected().getId();
        Reservation reservation = reservationMapper.reservationDTOToReservation(reservationDTO);
        validateReservationDate(reservation);

        // Associez l'utilisateur connecté et le poste de travail à la réservation
        reservation.setUser(userService.findById(userId).orElseThrow(() -> new RuntimeException("User not found with ID: " + userId)));
        workStationRepository.findById(reservationDTO.getWorkStation().getId()).ifPresent(reservation::setWorkStation);

        Reservation savedReservation = reservationRepository.save(reservation);
        return reservationMapper.reservationToReservationDTO(savedReservation);
    }

    // Méthode pour récupérer un utilisateur par ID, supposant l'existence d'une telle méthode dans UserService
    public Optional<User> findById(Long userId) {
        return userService.findById(userId);
    }

    public void validateReservationDate(Reservation reservation) {
        LocalDate today = LocalDate.now();
        LocalDate oneMonthLater = today.plusMonths(1);

        if (reservation.getReservationDate() == null) {
            throw new IllegalArgumentException("La date de réservation est requise.");
        }
        if (reservation.getReservationDate().isBefore(today)) {
            throw new IllegalArgumentException("La date de réservation ne peut être antérieure à aujourd'hui.");
        }
        if (reservation.getReservationDate().isAfter(oneMonthLater)) {
            throw new IllegalArgumentException("La date de réservation ne peut être ultérieure à un mois.");
        }
    }

    public void deleteReservation(Long reservationId) {
        if (reservationId == null) {
            throw new IllegalArgumentException("L'ID de réservation doit être spécifié lors de la suppression.");
        }

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Aucune réservation ne correspond à cet ID."));
        reservationRepository.delete(reservation);
    }
}
