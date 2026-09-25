package com.api_gateway.Service;

import com.api_gateway.Configuration.AppUserPrincipal;
import com.api_gateway.DTO.UserDto;
import com.api_gateway.Entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.awt.event.TextEvent;
import java.util.Set;

@Service
public class GoogleOauth2UserService extends OidcUserService {

    @Autowired
    UserServiceClient userServiceClient;

    @Autowired
    TextEncryptor textEncryptor;

    public OidcUser loadUser(OidcUserRequest userRequest)
    {
        System.out.println("load user method is running");
        OidcUser googleUser= super.loadUser(userRequest);

        String accessToken= userRequest.getAccessToken().getTokenValue();
        Set<String> scopes=userRequest.getAccessToken().getScopes();

        UserDto userDto= new UserDto();
        userDto.setAttributes(googleUser.getAttributes());

        userDto.setAccessToken(textEncryptor.encrypt(accessToken));
        userDto.setTokenScope(scopes);

        User user=new User();
        user.setOpenId(googleUser.getAttribute("sub"));
        user.setEmail(googleUser.getAttribute("email"));
            System.out.print(user);

        userServiceClient.createUser(userDto);

        return new AppUserPrincipal(user,googleUser);
    }





}
