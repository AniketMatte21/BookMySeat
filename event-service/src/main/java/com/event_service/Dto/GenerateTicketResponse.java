package com.event_service.Dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GenerateTicketResponse
{
    private String bookingId;
    private String owner;
    private String eventName;
    private LocalDate showDate;
    private LocalTime showTime;
    private String venueAddress;
    private String venueCity;
    private String venue;
    private List<BookedSeatsResponseDto> seats;
}
