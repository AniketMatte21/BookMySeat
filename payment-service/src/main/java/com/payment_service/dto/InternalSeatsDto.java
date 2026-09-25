package com.payment_service.dto;

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
