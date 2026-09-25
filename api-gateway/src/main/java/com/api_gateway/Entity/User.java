package com.api_gateway.Entity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User
{
    private String openId;
    private String email;
}
