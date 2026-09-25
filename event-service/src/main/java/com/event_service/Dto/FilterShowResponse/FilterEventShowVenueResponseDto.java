package com.event_service.Dto.FilterShowResponse;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FilterEventShowVenueResponseDto
{
        private Long eventId;
        private String title;
        private String language;
        private Integer durationMin;
        private List<FilterVenueResponseDto> filterVenueResponseDtoList;
}
