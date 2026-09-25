package com.event_service.Service;

import com.event_service.Dto.EventDto;
import com.event_service.Entity.Event;
import com.event_service.Repository.EventRepo;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService
{
    private final EventRepo eventRepo;

    public ResponseEntity<Event> addNewEvent(EventDto eventDto) {
        Event event = new Event();

        event.setTitle(eventDto.getTitle());
        event.setDescription(eventDto.getDescription());
        event.setCategory(eventDto.getCategory());
        event.setLanguage(eventDto.getLanguage());
        event.setGenre(eventDto.getGenre());
        event.setDurationMins(eventDto.getDurationMins());
        event.setCensorRating(eventDto.getCensorRating());
        event.setReleaseDate(eventDto.getReleaseDate());
        event.setPosterUrl(eventDto.getPosterUrl());
        event.setBannerUrl(eventDto.getBannerUrl());
        event.setTrailerUrl(eventDto.getTrailerUrl());

        Event savedEvent = eventRepo.save(event);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedEvent);
    }

    public List<Event> getAllEvents()
    {
        return eventRepo.findAll();
    }

    public ResponseEntity<Event> getEvent(Long eventId)
    {
        Event event = eventRepo.findById(eventId).orElseThrow(() -> new NotFoundException("Event not found with id: " + eventId));
        return ResponseEntity.status(HttpStatus.OK).body(event);
    }

}
