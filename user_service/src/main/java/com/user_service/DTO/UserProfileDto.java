package com.user_service.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDto
{
    private String email;
    private String firstName;
    private String lastName;
    private String contactNumber;
}
