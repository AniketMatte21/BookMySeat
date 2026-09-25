package com.event_service.Service.Clients;

import jakarta.ws.rs.Path;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient("USER-SERVICE")
public interface UserServiceClient
{
    @GetMapping("/api/users/getOwner/{userId}")
    public String getOwner(@PathVariable("userId") String userId);
}
