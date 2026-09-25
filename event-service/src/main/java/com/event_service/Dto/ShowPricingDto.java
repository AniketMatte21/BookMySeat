package com.event_service.Dto;

import com.event_service.Entity.Show;
import jakarta.persistence.Column;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShowPricingDto
{
    private Show show;
    private String tier;
    private BigDecimal basePrice;
    private BigDecimal convenienceFee = BigDecimal.ZERO;
    private String currency = "INR";

}
