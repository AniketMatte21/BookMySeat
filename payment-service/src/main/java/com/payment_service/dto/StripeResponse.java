package com.payment_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StripeResponse {
    private String status;
    private String message;
    private String sessionId;
    private String sessionUrl;
    private String bookingId;
}
