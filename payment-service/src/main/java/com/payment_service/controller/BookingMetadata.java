package com.payment_service.controller;

import com.payment_service.entity.Bookings;
import com.payment_service.repository.BookingRepo;
import jakarta.ws.rs.Path;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.AbstractSet;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
public class BookingMetadata {

    private final BookingRepo bookingRepo;

    @GetMapping("/userOpenId/{bookingId}")
    public String getUserOpenId(@PathVariable("bookingId") String bookingId)
    {
        System.out.println("bookingId : "+bookingId);
        List<Bookings> booking = bookingRepo.findByBookingId(bookingId);
        System.out.print(booking);
        if(booking==null|| booking.isEmpty()) throw new RuntimeException("Booking not found with id "+ bookingId);

        return booking.getFirst().getUserId();
    }

    @GetMapping("/byUserId/{userId}")
    public Set<String> getBookingUserId(@PathVariable("userId") String userId)
    {
        Set<Bookings> byUserId = bookingRepo.findByUserId(userId);
        if(byUserId.isEmpty()) throw new RuntimeException("User not found with id : "+userId);

        Set<String> bookingIds=new HashSet<>();
        for(Bookings booking:byUserId)
        {
            bookingIds.add(booking.getBookingId());
        }
        return bookingIds;

    }
}
