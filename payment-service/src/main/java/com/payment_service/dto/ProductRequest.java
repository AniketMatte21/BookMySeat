package com.payment_service.dto;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.payment_service.entity.OrderStatus;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest
{

    private String productName;
    private List<Long> Seats;
    private Long amount;
    private String currency;
    private Long quantity;
    private Long showId;
    private String token;


}
