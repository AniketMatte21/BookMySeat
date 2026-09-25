package com.event_service.Component;

import com.event_service.Dto.BookedSeatsResponseDto;
import com.event_service.Dto.ConfirmedSeatDto;
import com.event_service.Dto.GenerateTicketResponse;
import com.event_service.Entity.Seat;
import com.event_service.Entity.Show;
import com.event_service.Entity.ShowSeat;
import com.event_service.Repository.SeatRepo;
import com.event_service.Repository.ShowRepo;
import com.event_service.Repository.ShowSeatRepo;
import com.event_service.Service.Clients.PaymentServiceClient;
import com.event_service.Service.Clients.UserServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.awt.print.Book;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TicketGenerator {

    private final ShowRepo showRepo;
    private final SeatRepo seatRepo;
    private final UserServiceClient userServiceClient;
    private final ShowSeatRepo showSeatRepo;
    private final PaymentServiceClient paymentServiceClient;

    public GenerateTicketResponse generateTicket(String bookingId)
    {
        List<ShowSeat> booking = showSeatRepo.findByBookingId(bookingId);
        if(booking==null || booking.isEmpty()) throw new RuntimeException("booking not found for id : "+bookingId);

        String userId = userOpenId(bookingId);
        String ownerEmail = getOwnerEmail(userId);
        String eventName = booking.getFirst().getShow().getEvent().getTitle();
        LocalDate showDate = booking.getFirst().getShow().getShowDate();
        LocalTime startTime = booking.getFirst().getShow().getStartTime();
        String addressLine = booking.getFirst().getShow().getScreen().getVenue().getAddressLine();
        String city = booking.getFirst().getShow().getScreen().getVenue().getCity();
        String venue=booking.getFirst().getShow().getScreen().getVenue().getName();

        List<BookedSeatsResponseDto> list = booking.stream().map(item -> new BookedSeatsResponseDto(
                item.getSeat().getSeatId(),
                item.getSeat().getRowIdentifier(),
                item.getSeat().getTier()
        )).toList();

        return GenerateTicketResponse.builder().bookingId(
                bookingId
        ).owner(ownerEmail).eventName(eventName).showDate(showDate).showTime(startTime).venueAddress(
                addressLine
        ).venueCity(city).seats(
                list
        ).venue(venue).build();

    }

    //feign client--> get user mail by openId
    public String getOwnerEmail(String userOpenId)
    {
        return userServiceClient.getOwner(userOpenId);
    }

    public String userOpenId(String bookingId)
    {
        return paymentServiceClient.userOpenId(bookingId);
    }
}
