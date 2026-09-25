package com.event_service.Dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InternalSeatsDto
{
    private Long showId;
    private List<Long> seats;
    private String token;
}
