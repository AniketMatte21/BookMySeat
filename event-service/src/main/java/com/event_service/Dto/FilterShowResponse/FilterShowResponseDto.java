package com.event_service.Dto.FilterShowResponse;

import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FilterShowResponseDto
{

    private Long showId;
    private Long screenId;
    private LocalTime startTime;
    private LocalTime endTime;
    private String screenName;


}
