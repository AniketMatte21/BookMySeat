package com.event_service.Dto;

import jakarta.persistence.Column;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenueDto
{
    private String name;
    private String chainName;
    private String addressLine;
    private String city;
    private String state;
    private String postalCode;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer totalScreens;
    private String contactNumber;
}
