package com.payment_service.service.Clients;

import com.payment_service.dto.ConfirmedSeatDto;
import com.payment_service.dto.InternalSeatsDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient("EVENT-SERVICE")
public interface EventServiceClient {

    @PostMapping("/api/internal/seats/check-confirmed")
    public boolean checkConfirmed(@RequestBody InternalSeatsDto InternalSeatsDto );

    @PostMapping("/api/internal/seats/confirm")
    public void saveConfirmSeat(@RequestBody ConfirmedSeatDto confirmedSeatDto);

}
