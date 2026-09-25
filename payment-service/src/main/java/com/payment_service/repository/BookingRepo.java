package com.payment_service.repository;

import com.payment_service.entity.Bookings;
import com.payment_service.service.BookingService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Repository
public interface BookingRepo extends JpaRepository<Bookings, UUID> {

    boolean existsBySessionId(String sessionId);
    Bookings findBySessionId(String sessionId);
    List<Bookings> findByBookingId(String bookingId);

    //get all booking id's w.r.t to same userId
    Set<Bookings> findByUserId(String userId);
}
