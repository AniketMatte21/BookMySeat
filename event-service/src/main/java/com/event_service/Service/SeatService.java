package com.event_service.Service;

import com.event_service.Dto.SeatDto;
import com.event_service.Dto.Seats.EventVenueResponseDto;
import com.event_service.Dto.Seats.SeatResponseDto;
import com.event_service.Entity.Screen;
import com.event_service.Entity.Seat;
import com.event_service.Entity.Show;
import com.event_service.Entity.ShowSeat;
import com.event_service.Repository.ScreenRepo;
import com.event_service.Repository.SeatRepo;
import com.event_service.Repository.ShowRepo;
import com.event_service.Repository.ShowSeatRepo;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeatService {

    private final ScreenRepo screenRepo;
    private final SeatRepo seatRepo;
    private final ShowRepo showRepo;
    private final ShowSeatRepo showSeatRepo;


    //Generate all the seats related to the screen and saved in the db
    @Transactional
    public List<Seat> generateDefaultSeatsForScreen(Long screenId) {
        Screen screen = screenRepo.findById(screenId)
                .orElseThrow(() -> new NotFoundException("Screen not found with id: " + screenId));

        List<Seat> seats = new ArrayList<>();
        int rows = screen.getTotalRows();
        int cols = screen.getTotalColumns();

        for (int r = 1; r <= rows; r++) {
            // Convert row number 1 -> 'A', 2 -> 'B', etc.
            String rowLetter = String.valueOf((char) ('A' + (r - 1)));

            // Assign tiers based on row depth
            String tier;
            if (r <= 2) {
                tier = "RECLINER";
            } else if (r <= (rows / 2) + 1) {
                tier = "GOLD";
            } else {
                tier = "SILVER";
            }

            for (int c = 1; c <= cols; c++) {
                Seat seat = new Seat();
                seat.setScreen(screen);
                seat.setRowIdentifier(rowLetter);
                seat.setSeatNumber(c);
                seat.setGridRow(r);
                seat.setGridColumn(c);
                seat.setTier(tier);

                seats.add(seat);
            }
        }

        return seatRepo.saveAll(seats);
    }

    //fetching all the seats
    public ResponseEntity<EventVenueResponseDto> getAllSeatsSpecificToScreen(Long screenId,Long showId)
    {
        boolean isExist = screenRepo.existsById(screenId);
        if(!isExist) throw new NotFoundException("Screen Not Found with Id: "+ screenId);

        Show show = showRepo.findById(showId).orElseThrow(() -> new NotFoundException("Show Not Found For ID: " + showId));

        List<Seat> rawSeats = seatRepo.findByScreen_ScreenId(screenId);
        List<ShowSeat> seatsSpecificToShowId =showSeatRepo.findByShow_ShowId(showId);
        Set<Long> bookedSeatId= seatsSpecificToShowId.stream().
                map(r -> r.getSeat().getSeatId()).collect(Collectors.toSet());


        List<SeatResponseDto> list = rawSeats.stream().map(seat -> new SeatResponseDto(

                seat.getSeatId(),
                bookedSeatId.contains(seat.getSeatId()) ? "BOOKED" : "AVAILABLE",
                seat.getGridColumn(),
                seat.getGridRow(),
                seat.getSeatNumber(),
                seat.getRowIdentifier(),
                seat.getTier()

        )).toList();

        EventVenueResponseDto dto=new EventVenueResponseDto();
        dto.setEventId(show.getEvent().getEventId());
        dto.setVenueId(show.getScreen().getVenue().getVenueId());
        dto.setShowId(show.getShowId());
        dto.setTitle(show.getEvent().getTitle());
        dto.setVenueLocation(show.getScreen().getVenue().getName());
        dto.setCity(show.getScreen().getVenue().getCity());
        dto.setShowDate(show.getShowDate());
        dto.setShowTime(show.getStartTime());
        dto.setSeatResponseDtoList(list);

        return ResponseEntity.status(HttpStatus.OK).body(dto);



    }

}

