package com.event_service.Dto.Seats;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventVenueResponseDto
{
        private Long eventId;
        private Long venueId;
        private Long showId;
        private String title;
        private String venueLocation;
        private String city;
        private LocalDate showDate;
        private LocalTime showTime;
        private List<SeatResponseDto> seatResponseDtoList;
}
