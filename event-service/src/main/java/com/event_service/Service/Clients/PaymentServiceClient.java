package com.event_service.Service.Clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Set;

@FeignClient("PAYMENT-SERVICE")
public interface
PaymentServiceClient {

    @GetMapping("/api/booking/userOpenId/{bookingId}")
    public String userOpenId(@PathVariable("bookingId") String BookingId);

    @GetMapping("/api/booking/byUserId/{userId}")
    Set<String> bookingId(@PathVariable("userId") String userId);
}
