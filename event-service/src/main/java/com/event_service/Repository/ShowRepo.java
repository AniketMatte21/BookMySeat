package com.event_service.Repository;

import com.event_service.Entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ShowRepo extends JpaRepository<Show,Long> {

    // Checks if any existing show overlaps with the requested time window on the same screen
    @Query("""
        SELECT COUNT(s) > 0 FROM Show s
        WHERE s.screen.screenId = :screenId
          AND s.showDate = :showDate
          AND s.startTime < :endTime
          AND s.endTime > :startTime
    """)
    boolean existsOverlappingShow(
            @Param("screenId") Long screenId,
            @Param("showDate") LocalDate showDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );



    @Query(
            """
select s from Show s
where s.event.eventId= :eventId
and s.screen.venue.city= :city
and s.showDate= :showDate
and (s.showDate>current_date
or (s.showDate=current_date
and (s.startTime>=current_time or current_time between s.startTime and s.endTime))

)
"""
    )
    List<Show> getShowsByEventIdAndLocationAndDate(@Param("eventId") Long eventId,
                                                   @Param("city") String city,
                                                   @Param("showDate") LocalDate showDate);






}
