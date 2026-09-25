package com.payment_service.dto;

import com.payment_service.entity.OrderStatus;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDto
{
    private String productName;
    private List<Long> Seats;
    private Long amount;
    private String currency;
    private Long quantity;
    private Long showId;
    private Long userId;
}
