package com.event_service.Controller;

import com.event_service.Dto.*;
import com.event_service.Entity.*;
import com.event_service.Service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/event")
@RequiredArgsConstructor
public class EventHandler {

        private final VenueService venueService;
        private final EventService eventService;
        private final ScreenService screenService;
        private final SeatService seatService;
        private final ShowService showService;
        private final ShowPricingService showPricingService;

        @PostMapping("/add-venue")
        public ResponseEntity<Venue> createVenue(@RequestBody VenueDto venueDto)
        {
            return venueService.createVenue(venueDto);
        }

        @PostMapping("/add-new-event")
        public ResponseEntity<Event> addNewEvent(@RequestBody EventDto eventDto)
        {
            return eventService.addNewEvent(eventDto);
        }

        @GetMapping
        public List<Event> getAllEvents()
        {
            return eventService.getAllEvents();
        }

        @PostMapping("/add-screens")
        public List<Screen> setScreens(@RequestBody List<ScreenDto> screenDto)
        {
                return screenService.addScreensInVenue(screenDto);
        }


        @PostMapping("/add-seats/{screenId}")
        public ResponseEntity<List<Seat>> addSeats(
                @PathVariable Long screenId) {
                List<Seat> savedSeats = seatService.generateDefaultSeatsForScreen(screenId);
                return ResponseEntity.status(HttpStatus.CREATED).body(savedSeats);
        }

        @PostMapping("/add-show")
        public List<Show> addShow(@RequestBody List<ShowDto> showDto)
        {
                return showService.createShowsBatch(showDto);
        }

        @PostMapping("/auto-generate")
        public ResponseEntity<String> autoGeneratePricing() {
                List<Long> showIds = new ArrayList<>();

                // Shows 1 - 8
                for (long i = 1; i <= 8; i++) showIds.add(i);
                // Shows 47 - 158
                for (long i = 47; i <= 158; i++) showIds.add(i);

                List<ShowPricingDto> dtos = new ArrayList<>();
                for (Long id : showIds) {
                        Show show = new Show();
                        show.setShowId(id);

                        // Tier variation based on show ID
                        BigDecimal silverPrice = BigDecimal.valueOf(150 + (id % 4) * 20);
                        BigDecimal goldPrice = BigDecimal.valueOf(220 + (id % 4) * 30);
                        BigDecimal reclinerPrice = BigDecimal.valueOf(400 + (id % 4) * 50);

                        dtos.add(createDto(show, "SILVER", silverPrice, BigDecimal.valueOf(20)));
                        dtos.add(createDto(show, "GOLD", goldPrice, BigDecimal.valueOf(30)));
                        dtos.add(createDto(show, "RECLINER", reclinerPrice, BigDecimal.valueOf(40)));
                }

                showPricingService.saveShowPricingList(dtos);
                return ResponseEntity.ok("Saved pricing for " + showIds.size() + " shows.");
        }

        private ShowPricingDto createDto(Show show, String tier, BigDecimal base, BigDecimal fee) {
                ShowPricingDto dto = new ShowPricingDto();
                dto.setShow(show);
                dto.setTier(tier);
                dto.setBasePrice(base);
                dto.setConvenienceFee(fee);
                dto.setCurrency("INR");
                return dto;
        }
}
