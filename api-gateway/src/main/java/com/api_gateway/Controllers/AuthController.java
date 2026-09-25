package com.api_gateway.Controllers;

import com.api_gateway.Configuration.AppUserPrincipal;
import com.api_gateway.Configuration.CurrentUser;
import com.api_gateway.Entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("http://localhost:5173")
public class AuthController
{

    private  String backendUrl;
    
    @Autowired
    private  CurrentUser currentUser;

    public AuthController(@Value("${app.backend-url}") String backendUrl) {
        this.backendUrl = backendUrl;
    }

    @GetMapping("/login")
        public Map<String, Object> loginUrl()
        {
            System.out.println("login url called");
            return Map.of("url", backendUrl+"/oauth2/authorization/google");

        }

        @GetMapping("/me")
        public ResponseEntity<User> getUserInfo()
        {
            AppUserPrincipal principal = currentUser.require();
            User userInfo = principal.getUser();
            return ResponseEntity.ok(userInfo);

        }

}
