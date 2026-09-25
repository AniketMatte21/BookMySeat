package com.event_service.Dto.FilterShowResponse;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FilterVenueResponseDto
{
        private Long venueId;
        private String cityAddress;
        private String venueLocation;
        private List<FilterShowResponseDto> filterShowResponseDto;
}
