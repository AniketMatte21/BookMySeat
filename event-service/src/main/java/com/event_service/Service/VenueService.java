package com.event_service.Service;

import com.event_service.Dto.VenueDto;
import com.event_service.Entity.Venue;
import com.event_service.Repository.VenueRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VenueService {

    private final VenueRepo venueRepo;

    public ResponseEntity<Venue> createVenue(VenueDto venueDto)
    {
            Venue venue= new Venue();
            venue.setName(venueDto.getName());
            venue.setChainName(venueDto.getChainName());
            venue.setCity(venueDto.getCity());
            venue.setAddressLine(venueDto.getAddressLine());
            venue.setContactNumber(venueDto.getContactNumber());
            venue.setPostalCode(venueDto.getPostalCode());
            venue.setState(venueDto.getState());
            venue.setTotalScreens(venueDto.getTotalScreens());
            venue.setLatitude(venueDto.getLatitude());
            venue.setLongitude(venueDto.getLongitude());

            return ResponseEntity.ok(venueRepo.save(venue));
    }
}
