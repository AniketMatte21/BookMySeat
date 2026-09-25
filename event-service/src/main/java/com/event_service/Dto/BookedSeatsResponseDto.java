package com.event_service.Dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookedSeatsResponseDto
{
    public Long seatId;
    public String rowIdentifier;
    public String tier;

}
