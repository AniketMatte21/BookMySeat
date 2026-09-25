package com.event_service.Dto;

import com.event_service.Entity.Venue;
import jakarta.persistence.Column;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ScreenDto {

    private Venue venue;
    private String name;
    private String format = "2D";
    private Integer totalSeats = 0;
    private Integer totalRows;
    private Integer totalColumns;
}
