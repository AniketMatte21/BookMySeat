package com.payment_service.service;

import com.payment_service.dto.BookingDto;
import com.payment_service.dto.ConfirmedSeatDto;
import com.payment_service.dto.InternalSeatsDto;
import com.payment_service.dto.ProductRequest;
import com.payment_service.entity.Bookings;
import com.payment_service.entity.OrderStatus;
import com.payment_service.repository.BookingRepo;
import com.payment_service.service.Clients.EventServiceClient;
import com.stripe.exception.StripeException;
import com.stripe.model.LineItem;
import com.stripe.model.LineItemCollection;
import com.stripe.model.checkout.Session;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;


@Component
@RequiredArgsConstructor
public class BookingService {

    private  final BookingRepo bookingRepo;
    private final EventServiceClient eventServiceClient;



    @Transactional
    public void saveSuccessfulOrder(Session session) {
        String sessionId = session.getId();

        //get all the metadata / order details from the session
        Map<String, String> metadata = session.getMetadata();

        if (metadata == null || metadata.isEmpty()) {
            throw new IllegalStateException("Missing metadata in Stripe session: " + sessionId);
        }

        // Retrieve line items separately from Stripe
        LineItemCollection lineItems;

        try {
            lineItems = session.listLineItems();
        } catch (StripeException e) {
            throw new IllegalStateException(
                    "Failed to retrieve line items for session: " + sessionId,
                    e
            );
        }

        if (lineItems == null || lineItems.getData().isEmpty()) {
            throw new IllegalStateException(
                    "Missing LineItems for Stripe session: " + sessionId
            );
        }

        String userId = metadata.get("userId");
        Long showId = Long.valueOf(metadata.get("showId"));
        String token=metadata.get("token");
        String bookingId=metadata.get("bookingId");

        // Parse seat IDs from comma-separated string (e.g., "101,102,104")
        List<Long> seatIds = Arrays.stream(metadata.get("seats").split(","))
                .map(String::trim)
                .map(Long::valueOf)
                .toList();

        //run Lua script
        boolean bool = eventServiceClient.checkConfirmed(
                InternalSeatsDto.builder().showId(showId).seats(seatIds).token(token).build()
        );
        if(bool)
        {
            System.out.println("key permanently saved in redis");
            List<Bookings> bookingsList = new ArrayList<>();

            for (Long seatId : seatIds) {
                Bookings booking = new Bookings();
                booking.setUserId(userId);
                booking.setBookingId(bookingId);
                booking.setSeatId(seatId);
                booking.setShowId(showId);
                booking.setOrderStatus(OrderStatus.PAID);
                booking.setSessionId(sessionId);
                lineItems.getData().forEach(item->{
                        booking.setProductName(item.getDescription());
                        booking.setCurrency(item.getCurrency());
                        booking.setQuantity(item.getQuantity());
                        booking.setTotalAmount((double) item.getAmountTotal() / 100);
                });


                bookingsList.add(booking);
            }

            // Persist all seats in one batch query
            bookingRepo.saveAll(bookingsList);


            //save confirm seats in shw_seat table
            ConfirmedSeatDto confirmedSeatDto=new ConfirmedSeatDto();
            confirmedSeatDto.setBookingId(bookingId);
            confirmedSeatDto.setPricePaid(  BigDecimal.valueOf(lineItems.getData().stream().mapToDouble(LineItem::getAmountTotal).sum()/100));
            confirmedSeatDto.setSeats(seatIds);
            confirmedSeatDto.setShowId(showId);
            confirmedSeatDto.setUserId(userId);
            eventServiceClient.saveConfirmSeat(confirmedSeatDto);



            return;

        }

        System.out.println("key is expired");
        // initiate refund







    }


}
