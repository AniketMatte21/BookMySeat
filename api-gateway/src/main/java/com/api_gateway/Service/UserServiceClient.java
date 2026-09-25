package com.api_gateway.Service;

import com.api_gateway.DTO.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "USER-SERVICE", url = "http://localhost:8081")
public interface UserServiceClient {

    @PostMapping("/api/users")
     String createUser(@RequestBody UserDto userDto);

}
