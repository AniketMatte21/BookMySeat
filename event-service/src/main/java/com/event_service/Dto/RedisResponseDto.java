package com.event_service.Dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RedisResponseDto
{
    private Long showId;
    private List<Long> lockedSeatId;
    private String token;



}
