package com.event_service.Controller;

import com.event_service.Component.TicketGenerator;
import com.event_service.Dto.GenerateTicketResponse;
import com.event_service.Dto.RedisResponseDto;
import com.event_service.Service.SeatBookingService;
import com.event_service.Service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
public class SeatHandler
{
    private final SeatBookingService seatBookingService;
    private final TicketGenerator ticketGenerator;
    private final TicketService ticketService;

    @PostMapping("/book-seats")
    public RedisResponseDto setKeys(@RequestParam("showId") Long showId,@RequestBody List<Long> seats)
    {
        return seatBookingService.setKey(showId,seats);
    }

    @GetMapping("/ticket/{bookingId}")
    public ResponseEntity<?> generateTicket(@PathVariable("bookingId") String bookingId)
    {
        GenerateTicketResponse generateTicketResponse = ticketGenerator.generateTicket(bookingId);
        return new ResponseEntity<>(generateTicketResponse, HttpStatus.OK);
    }

    @GetMapping("/get-tickets-by-userId")
    public ResponseEntity<?> getAllTicketsByUserId(@RequestHeader("x-user-id") String userId)
    {
        List<GenerateTicketResponse> list = ticketService.getTicketsByUserId(userId);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
}
