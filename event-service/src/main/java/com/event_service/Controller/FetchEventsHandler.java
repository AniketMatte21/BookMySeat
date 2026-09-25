package com.event_service.Controller;

import com.event_service.Dto.FilterShowResponse.FilterEventShowVenueResponseDto;
import com.event_service.Dto.FilterShowResponse.FilterShowResponseDto;
import com.event_service.Dto.Seats.EventVenueResponseDto;
import com.event_service.Entity.Event;
import com.event_service.Entity.Show;
import com.event_service.Service.EventService;
import com.event_service.Service.SeatService;
import com.event_service.Service.ShowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/event")
@RequiredArgsConstructor
public class FetchEventsHandler
{
    private final EventService eventService;
    private final ShowService showService;
    private final SeatService seatService;

    @GetMapping("/{eventId}")
    public ResponseEntity<Event> getEvent(@PathVariable Long eventId)
    {
        return eventService.getEvent(eventId);
    }

    @GetMapping("/shows/{eventId}")
    public ResponseEntity<FilterEventShowVenueResponseDto> getShowsByEventId(@PathVariable("eventId") Long eventId,
                                                                             @RequestParam String city,
                                                                             @RequestParam LocalDate showDate)
    {
        return showService.getFilterShow(eventId,city,showDate);
    }

    @GetMapping("/seats/{screenId}/{showId}")
    public ResponseEntity<EventVenueResponseDto> getSeatsForShow(@PathVariable("screenId") Long screenId, @PathVariable("showId") Long showId)
    {
        return seatService.getAllSeatsSpecificToScreen(screenId,showId);
    }
}
