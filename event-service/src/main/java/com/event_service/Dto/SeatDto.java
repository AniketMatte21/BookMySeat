package com.event_service.Dto;

import com.event_service.Entity.Screen;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatDto
{
    private Screen screen;
    private String rowIdentifier;
    private Integer seatNumber;
    private String tier;
    private Integer gridRow;
    private Integer gridColumn;

}
