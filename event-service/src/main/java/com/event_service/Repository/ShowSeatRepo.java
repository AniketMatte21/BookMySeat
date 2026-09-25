package com.event_service.Repository;

import com.event_service.Entity.ShowSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShowSeatRepo extends JpaRepository<ShowSeat,Long> {

    List<ShowSeat> findByShow_ShowId(Long showId);
    List<ShowSeat> findByBookingId(String bookingId);
}
