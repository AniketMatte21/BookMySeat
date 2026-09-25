package com.user_service.DTO;

import lombok.*;

import java.util.Map;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    private Map<String, Object> attributes;
    private String accessToken;
    private Set<String> tokenScope;
}
