package com.notification_service.Dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailNotificationDto
{
        private String showName;
        private String bookingId;
        private String pricePaid;
        private String userId;
        private String userEmail;
}
