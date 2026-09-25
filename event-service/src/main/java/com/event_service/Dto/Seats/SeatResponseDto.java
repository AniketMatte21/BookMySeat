package com.event_service.Dto.Seats;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SeatResponseDto
{
    private Long seatId;
    private String seatStatus;
    private Integer gridColumn;
    private Integer gridRow;
    private Integer seatNumber;
    private String rowIdentifier;
    private String tier;
}
