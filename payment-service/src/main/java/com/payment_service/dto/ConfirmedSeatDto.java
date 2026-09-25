package com.payment_service.dto;


import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConfirmedSeatDto
{
    private Long showId;
    private List<Long> seats;
    private String bookingId;
    private BigDecimal pricePaid;
    private String userId;


}
