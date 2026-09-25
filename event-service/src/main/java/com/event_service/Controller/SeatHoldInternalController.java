package com.event_service.Controller;

import com.event_service.Dto.ConfirmedSeatDto;
import com.event_service.Dto.InternalSeatsDto;
import com.event_service.Service.SeatBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/api/internal/seats")
@RequiredArgsConstructor
public class SeatHoldInternalController {

    private final SeatBookingService seatBookingService;

    @PostMapping("/check-confirmed")
    public boolean confirmHoldSeat(@RequestBody InternalSeatsDto dto)
    {
        return seatBookingService.managedInternalSeats(dto.getShowId(),dto.getSeats(),dto.getToken());
    }


    @PostMapping("/confirm")
    public void saveConfirmSeat(@RequestBody ConfirmedSeatDto confirmedSeatDto)
    {
        seatBookingService.saveConfirmSeats(confirmedSeatDto);
    }


}
