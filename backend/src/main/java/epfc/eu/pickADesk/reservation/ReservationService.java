package epfc.eu.pickADesk.reservation;

import epfc.eu.pickADesk.dto.ReservationDTO;
import epfc.eu.pickADesk.exceptions.UserNotFoundException;
import epfc.eu.pickADesk.user.User;
import epfc.eu.pickADesk.user.UserRepository;
import epfc.eu.pickADesk.user.UserService;
import epfc.eu.pickADesk.workStation.WorkStationRepository;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final ReservationMapper reservationMapper;
    private final WorkStationRepository workStationRepository;

    @Autowired
    public ReservationService(ReservationRepository reservationRepository, UserService userService, UserRepository userRepository, ReservationMapper reservationMapper, WorkStationRepository workStationRepository) {
        this.reservationRepository = reservationRepository;
        this.userService = userService;
        this.userRepository = userRepository;
        this.reservationMapper = reservationMapper;
        this.workStationRepository = workStationRepository;
    }

    public ReservationDTO findReservationById(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found with ID: " + reservationId));
        return reservationMapper.reservationToReservationDTO(reservation);
    }

    public List<ReservationDTO> hasReservationToday() {
        Long userId = this.userService.getUserConnected().getId();
        LocalDate today = LocalDate.now();

        List<Reservation> reservations = this.reservationRepository.findReservationsForTodayWithFlexibleTiming(userId, today);
        return reservations.stream()
                .map(reservationMapper::reservationToReservationDTO)
                .collect(Collectors.toList());
    }

    public List<ReservationDTO> EmployeeHasReservationToday(Long employeeId) {
        LocalDate today = LocalDate.now();

        List<Reservation> reservations = this.reservationRepository.findReservationsForTodayWithFlexibleTiming(employeeId, today);
        return reservations.stream()
                .map(reservationMapper::reservationToReservationDTO)
                .collect(Collectors.toList());
    }

    public List<ReservationDTO> EmployeeHasReservationThisDay(Long employeeId, LocalDate date) {
        List<Reservation> reservations = this.reservationRepository.findReservationsByUserIdAndReservationDate(employeeId, date);
        return reservations.stream()
                .map(reservationMapper::reservationToReservationDTO)
                .collect(Collectors.toList());
    }

    public List<ReservationDTO> EmployeeHasReservationThisWeek(Long employeeId) {
        LocalDate start = LocalDate.now();
        LocalDate end = start.plusDays(6);

        List<Reservation> reservations = this.reservationRepository.findByUserIdAndReservationDateBetween(employeeId, start, end);
        return reservations.stream()
                .map(reservationMapper::reservationToReservationDTO)
                .collect(Collectors.toList());
    }

    public List<ReservationDTO> getReservationsForWeek(Long userId, LocalDate anyDayOfWeek) {

        LocalDate monday = anyDayOfWeek.with(DayOfWeek.MONDAY);
        LocalDate friday = monday.plusDays(4);

        List<Reservation> reservations = this.reservationRepository.findByUserIdAndReservationDateBetween(userId, monday, friday);

        return reservations.stream()
                .map(reservationMapper::reservationToReservationDTO)
                .toList();
    }

    public double getMemberQuota(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found")).getMemberQuota();
    }

    public List<ReservationDTO> hasReservationTomorrow() {
        Long userId = this.userService.getUserConnected().getId();
        LocalDate tomorrow = LocalDate.now().plusDays(1);

        List<Reservation> reservations = this.reservationRepository.findReservationsForTodayWithFlexibleTiming(userId, tomorrow);
        return reservations.stream()
                .map(reservationMapper::reservationToReservationDTO)
                .collect(Collectors.toList());
    }

    public List<ReservationDTO> getReservationsByFilter(String filter) {
        Long userId = this.userService.getUserConnected().getId();
        LocalDate now = LocalDate.now();
        LocalDate start, end;

        end = switch (filter) {
            case "week" -> {
                start = now.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
                yield now.with(TemporalAdjusters.nextOrSame(java.time.DayOfWeek.SUNDAY));
            }
            case "month" -> {
                start = now.with(TemporalAdjusters.firstDayOfMonth());
                yield now.with(TemporalAdjusters.lastDayOfMonth());
            }
            default -> throw new IllegalArgumentException("Filtre non supporté: " + filter);
        };

        List<Reservation> filteredReservations = reservationRepository.findByUserIdAndReservationDateBetween(userId, start, end);

        if (filteredReservations.isEmpty()) {
            return (Collections.emptyList());
        }

        return filteredReservations.stream()
                .map(reservationMapper::reservationToReservationDTO)
                .collect(Collectors.toList());
    }


    public List<ReservationDTO> findPastReservationsLastThreeMonths() {
        Long userId = this.userService.getUserConnected().getId();
        LocalDate threeMonthsAgo = LocalDate.now().minusMonths(3);
        LocalDate today = LocalDate.now();

        List<Reservation> pastReservations = reservationRepository.findByUserIdAndReservationDateBetween(userId, threeMonthsAgo, today);

        if (pastReservations.isEmpty()) {
            return (Collections.emptyList());
        }

        return pastReservations.stream()
                .map(reservationMapper::reservationToReservationDTO)
                .collect(Collectors.toList());
    }

    public List<ReservationDTO> findNextMonthReservations() {
        Long userId = this.userService.getUserConnected().getId();
        LocalDate onMonth = LocalDate.now().plusMonths(2);
        LocalDate today = LocalDate.now();

        List<Reservation> futureReservations = reservationRepository.findByUserIdAndReservationDateBetween(userId, today, onMonth);

        if (futureReservations.isEmpty()) {
            return (Collections.emptyList());
        }

        return futureReservations.stream()
                .map(reservationMapper::reservationToReservationDTO)
                .collect(Collectors.toList());
    }

    public List<ReservationDTO> addIndividualReservation(ReservationDTO reservationDTO) {
        List<ReservationDTO> results = new ArrayList<>();
        Long userId;

        if (reservationDTO.getColleagueId() != null) {
            userId = reservationDTO.getColleagueId();
            reservationDTO.setColleagueBooking(true);
        } else {
            userId = this.userService.getUserConnected().getId();
            reservationDTO.setColleagueBooking(false);
        }

        Reservation reservation = reservationMapper.reservationDTOToReservation(reservationDTO);

        List<Reservation> existingReservations = reservationRepository.findReservationsForTodayWithFlexibleTiming(userId, reservation.getReservationDate());

        for (Reservation existingReservation : existingReservations) {
            if ((reservationDTO.getMorning() != null && reservationDTO.getMorning().equals(existingReservation.getMorning()) && reservationDTO.getMorning())
                    || (reservationDTO.getAfternoon() != null && reservationDTO.getAfternoon().equals(existingReservation.getAfternoon()) && reservationDTO.getAfternoon())) {
                throw new IllegalStateException("Reservation already exists for this user on the specified date and time slot.");
            }
        }

        validateReservationDate(reservation);
        reservation.setUser(userService.findById(userId).orElseThrow(() -> new RuntimeException("User not found with ID: " + userId)));
        reservation.setCreatedBy(this.userService.getUserConnected().getId());
        reservation.setGroupBooking(reservationDTO.isGroupBooking());
        reservation.setColleagueBooking(reservationDTO.isColleagueBooking());
        workStationRepository.findById(reservationDTO.getWorkStation().getId()).ifPresent(reservation::setWorkStation);
        reservation.setMorning(reservationDTO.getMorning());
        reservation.setAfternoon(reservationDTO.getAfternoon());
        Reservation savedReservation = reservationRepository.save(reservation);
        results.add(reservationMapper.reservationToReservationDTO(savedReservation));
        return results;
    }

    @Transactional
    public List<ReservationDTO> addGroupReservations(List<ReservationDTO> reservationDTOs) {

        Long userId = this.userService.getUserConnected().getId();
        List<ReservationDTO> results = new ArrayList<>();

        for (ReservationDTO dto : reservationDTOs) {
            try {
                User member = userService.findById(dto.getUserId())
                        .orElseThrow(() -> new RuntimeException("User not found with ID: " + dto.getUserId()));
                Reservation reservation = reservationMapper.reservationDTOToReservation(dto);
                reservation.setUser(member);
                reservation.setCreatedBy(userId);
                reservation.setGroupBooking(true);
                workStationRepository.findById(dto.getWorkStation().getId()).ifPresent(reservation::setWorkStation);
                reservation.setMorning(dto.getMorning());
                reservation.setAfternoon(dto.getAfternoon());
                results.add(reservationMapper.reservationToReservationDTO(reservationRepository.save(reservation)));
            } catch (Exception e) {
                throw new ServiceException("Error processing reservation", e);
            }
        }
        return results;
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

    public boolean isExistingReservation(Long userId, LocalDate reservationDate, Boolean checkMorning, Boolean checkAfternoon) {
        // Si vérification pour toute la journée
        if (checkMorning && checkAfternoon) {
            // Vérifiez d'abord si une réservation existe pour toute la journée
            boolean isReservedForWholeDay = reservationRepository.findByUserIdAndReservationDateAndMorningAndAfternoon(userId, reservationDate, true, true).isPresent();
            // Vérifiez ensuite pour n'importe quelle réservation le matin ou l'après-midi
            boolean isReservedForAnyPartOfDay = reservationRepository.findByUserIdAndReservationDate(userId, reservationDate)
                    .stream()
                    .anyMatch(reservation -> reservation.isMorning() || reservation.isAfternoon());
            return isReservedForWholeDay || isReservedForAnyPartOfDay;
        } else if (checkMorning) {
            // Vérifiez uniquement pour le matin
            return reservationRepository.findByUserIdAndReservationDateAndMorning(userId, reservationDate, true).isPresent();
        } else if (checkAfternoon) {
            // Vérifiez uniquement pour l'après-midi
            return reservationRepository.findByUserIdAndReservationDateAndAfternoon(userId, reservationDate, true).isPresent();
        }
        return false; // Aucune vérification nécessaire si les deux sont faux
    }

    public boolean isWorkStationUnavailable(Long workStationId, LocalDate reservationDate, Boolean checkMorning, Boolean checkAfternoon) {
        if (workStationId == null || reservationDate == null) {
            throw new IllegalArgumentException("WorkStation ID and reservation date must not be null.");
        }
        // Cette vérification garantit que l'une des conditions est requise
        if (!checkMorning && !checkAfternoon) {
            return false;  // Si aucune période n'est à vérifier, retourner "faux" (disponible)
        }

        try {
            boolean morningUnavailable = checkMorning && reservationRepository.findByWorkStationIdAndReservationDateAndMorning(workStationId, reservationDate, true).isPresent();
            boolean afternoonUnavailable = checkAfternoon && reservationRepository.findByWorkStationIdAndReservationDateAndAfternoon(workStationId, reservationDate, true).isPresent();

            return morningUnavailable || afternoonUnavailable;  // Retourne vrai si l'une ou l'autre période est indisponible
        } catch (Exception e) {
            throw new RuntimeException("Error accessing reservation data.", e);
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
    @Transactional
    public void deleteManagerGroupReservations(LocalDate reservationDate, Long managerId) {
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));
        Integer teamId = manager.getTeamId();

        List<Long> userIds = userRepository.findUsersByTeamId(teamId).stream()
                .map(User::getId)
                .collect(Collectors.toList());

        if (userIds.isEmpty()) {
            throw new IllegalStateException("No users found in manager's team");
        }

        reservationRepository.deleteGroupReservationsByManager(managerId, reservationDate, userIds);
    }


}
