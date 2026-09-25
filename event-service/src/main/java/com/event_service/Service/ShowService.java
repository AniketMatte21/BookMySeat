package com.event_service.Service;

import com.event_service.Dto.FilterShowResponse.FilterEventShowVenueResponseDto;
import com.event_service.Dto.FilterShowResponse.FilterShowResponseDto;
import com.event_service.Dto.FilterShowResponse.FilterVenueResponseDto;
import com.event_service.Dto.ShowDto;
import com.event_service.Entity.Event;
import com.event_service.Entity.Screen;
import com.event_service.Entity.Show;
import com.event_service.Entity.Venue;
import com.event_service.Repository.EventRepo;
import com.event_service.Repository.ScreenRepo;
import com.event_service.Repository.ShowRepo;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ShowService {

    private final ShowRepo showRepo;
    private final EventRepo eventRepo;
    private final ScreenRepo screenRepo;

    @Transactional
    public List<Show> createShowsBatch(List<ShowDto> dtos) {
        return dtos.stream()
                .map(this::createShow)
                .toList();
    }

    @Transactional
    public Show createShow(ShowDto dto) {
        // 1. Fetch managed Event entity
        Event event = eventRepo.findById(dto.getEvent().getEventId())
                .orElseThrow(() -> new NotFoundException("Event not found with id: " + dto.getEvent().getEventId()));

        // 2. Fetch managed Screen entity
        Screen screen = screenRepo.findById(dto.getScreen().getScreenId())
                .orElseThrow(() -> new NotFoundException("Screen not found with id: " + dto.getScreen().getScreenId()));

        // 3. Compute endTime if omitted (adds movie duration + 20-min cleaning buffer)
        LocalTime calculatedEndTime = dto.getEndTime();
        if (calculatedEndTime == null) {
            calculatedEndTime = dto.getStartTime().plusMinutes(event.getDurationMins() + 20);
        }

        // Validate time sequence
        if (!calculatedEndTime.isAfter(dto.getStartTime())) {
            throw new IllegalArgumentException("Show end time must be after start time");
        }

        // 4. Overlap check on the same screen
        boolean hasConflict = showRepo.existsOverlappingShow(
                screen.getScreenId(),
                dto.getShowDate(),
                dto.getStartTime(),
                calculatedEndTime
        );

        if (hasConflict) {
            throw new IllegalStateException("Screen is already booked for an overlapping show during this time slot.");
        }

        // 5. Construct and persist entity
        Show show = new Show();
        show.setEvent(event);
        show.setScreen(screen);
        show.setShowDate(dto.getShowDate());
        show.setStartTime(dto.getStartTime());
        show.setEndTime(calculatedEndTime);

        return showRepo.save(show);
    }


    //get all shows related to an event
    public List<Show> getShowsSpecificToEventId(Long eventId, String city, LocalDate showDate)
    {
        boolean isExist = eventRepo.existsById(eventId);
        if(!isExist) throw new NotFoundException("Event not found with id "+eventId);

        return showRepo.getShowsByEventIdAndLocationAndDate(eventId,city,showDate);
    }

    //filter show data

    public ResponseEntity<FilterEventShowVenueResponseDto> getFilterShow(Long eventId, String city, LocalDate showDate)
    {
        List<Show> rawShows = getShowsSpecificToEventId(eventId, city, showDate);

        Optional<Event> event = eventRepo.findById(eventId);

        // Grouping By Venue
        Map<Venue, List<Show>> groupByVenue=
                rawShows.stream().collect(Collectors.groupingBy(show-> show.getScreen().getVenue()));

        //filter the response
        List<FilterVenueResponseDto> responseDtos= new ArrayList<>();
        for(Map.Entry<Venue,List<Show>> entry: groupByVenue.entrySet())
        {
            Venue key = entry.getKey();
            List<Show> value = entry.getValue();

            //Convert show entity to FilterShowResponseDto
            List<FilterShowResponseDto> filterShowResponseDtoStream = value.stream().map(s -> new FilterShowResponseDto(
                    s.getShowId(),
                    s.getScreen().getScreenId(),
                    s.getStartTime(),
                    s.getEndTime(),
                    s.getScreen().getName()

            )).toList();

            FilterVenueResponseDto dtos = FilterVenueResponseDto.builder().venueId(key.getVenueId()).cityAddress(key.getCity()).venueLocation(key.getName()).filterShowResponseDto(filterShowResponseDtoStream).build();

                responseDtos.add(dtos);
        }
        
        
        FilterEventShowVenueResponseDto shows= FilterEventShowVenueResponseDto.builder()
                .eventId(event.get().getEventId()).title(event.get().getTitle()).language(event.get().getLanguage()).durationMin(event.get().getDurationMins()).filterVenueResponseDtoList(responseDtos).build();

        return ResponseEntity.status(HttpStatus.OK).body(shows);



    }









}
