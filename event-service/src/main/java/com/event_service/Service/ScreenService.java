package com.event_service.Service;

import com.event_service.Dto.ScreenDto;
import com.event_service.Entity.Screen;
import com.event_service.Entity.Venue;
import com.event_service.Repository.ScreenRepo;
import com.event_service.Repository.VenueRepo;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.AbstractList;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ScreenService
{

    private final ScreenRepo screenRepo;
    private final VenueRepo venueRepo;

    public List<Screen> addScreensInVenue(List<ScreenDto> screenDto)
    {

        List<Screen> addAllScreens=new ArrayList<>();
        for(ScreenDto dto: screenDto)
        {
            Screen screen=new Screen();
            Venue venue = venueRepo.findById(dto.getVenue().getVenueId()).orElseThrow(() -> new NotFoundException("Venue not found"));
            screen.setName(dto.getName());
            screen.setFormat(dto.getFormat());
            screen.setTotalSeats(dto.getTotalSeats());
            screen.setTotalRows(dto.getTotalRows());
            screen.setTotalColumns(dto.getTotalColumns());
            screen.setVenue(venue);
            addAllScreens.add(screen);
        }

        return screenRepo.saveAll(addAllScreens);


    }

}
