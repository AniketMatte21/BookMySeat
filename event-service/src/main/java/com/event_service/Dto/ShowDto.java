package com.event_service.Dto;

import com.event_service.Entity.Event;
import com.event_service.Entity.Screen;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShowDto
{
    private Event event;
    private Screen screen;
    private LocalDate showDate;
    private LocalTime startTime;
    private LocalTime endTime;

}
