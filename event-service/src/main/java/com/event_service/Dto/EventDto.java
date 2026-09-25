package com.event_service.Dto;

import jakarta.persistence.Column;
import lombok.*;

import java.time.LocalDate;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventDto
{

    private String title;
    private String description;
    private String category;
    private String language;
    private String genre;
    private Integer durationMins;
    private String censorRating;
    private LocalDate releaseDate;
    private String posterUrl;
    private String bannerUrl;
    private String trailerUrl;

}
