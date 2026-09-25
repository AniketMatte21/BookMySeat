package com.event_service.Repository;

import com.event_service.Entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepo extends JpaRepository<Seat,Long> {

    List<Seat> findByScreen_ScreenId(Long ScreenId);
}
