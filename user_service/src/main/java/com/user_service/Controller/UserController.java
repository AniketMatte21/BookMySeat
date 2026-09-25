package com.user_service.Controller;

import com.user_service.DTO.UserDto;
import com.user_service.DTO.UserProfileDto;
import com.user_service.Entity.User;
import com.user_service.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

        private final UserService userService;

            @PostMapping
            public String createNewUser(@RequestBody UserDto userDto)
            {
                Map<String,Object> attributes= userDto.getAttributes();
                String accessToken= userDto.getAccessToken();
                Set<String> tokenScope= userDto.getTokenScope();
                System.out.println("attributes "+attributes);
                System.out.println("accessToken "+ accessToken);
                System.out.println("tokenScope "+ tokenScope);
                return userService.upsertUser(attributes,accessToken,tokenScope);


            }


            @GetMapping("/showProfile")
            public ResponseEntity<UserProfileDto> userProfile(@RequestHeader("X-User-OpenId") String openId)
            {
                return userService.showProfile(openId);
            }

            @GetMapping("/getOwner/{userId}")
            public String getOwner(@PathVariable("userId") String userId)
            {
                return userService.getOwnerMail(userId);
            }
}
