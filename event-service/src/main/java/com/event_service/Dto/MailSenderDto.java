package com.event_service.Dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MailSenderDto
{
    private String showName;
    private String bookingId;
    private BigDecimal pricePaid;
    private String userId;
    private String userEmail;

}
