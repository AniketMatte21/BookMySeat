package com.user_service.Service;

import com.user_service.DTO.UserProfileDto;
import com.user_service.Entity.User;
import com.user_service.Repository.UserRepository;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;


    public String upsertUser(Map<String,Object> attributes, String accessToken, Set<String> scopes)
    {
            String openId= String.valueOf(attributes.get("sub"));
            String email= String.valueOf(attributes.get("email"));

            // if user already exists get that user , if not create  new user
        User user = userRepository.findByOpenId(openId).orElseGet(User::new);

        user.setEmail(email);
        user.setOpenId(openId);
        user.setAccessToken(accessToken);
        user.setScopes(String.join(",", scopes));

        userRepository.save(user);
        return "User successfully saved";

    }

    public ResponseEntity<UserProfileDto> showProfile(String openId)
    {
        User user = userRepository.findByOpenId(openId).orElseThrow(() -> new NotFoundException("User not found"));

        UserProfileDto userProfileDto= new UserProfileDto();
        userProfileDto.setEmail(user.getEmail());
        userProfileDto.setFirstName(user.getFirstName());
        userProfileDto.setLastName(user.getLastName());
        userProfileDto.setContactNumber(user.getContactNumber());


        return ResponseEntity.ok(userProfileDto);
    }

    public String getOwnerMail(String openId)
    {
        User user = userRepository.findByOpenId(openId).orElseThrow(() -> new RuntimeException("Open Id not found for id : " + openId));
        return user.getEmail();
    }
}
