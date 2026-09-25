package com.api_gateway.Security;

import com.api_gateway.Service.GoogleOauth2UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.*;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Slf4j
@EnableWebSecurity
@Configuration
public class SecurityConfig {

        private final GoogleOauth2UserService googleOauth2UserService;

        public SecurityConfig(GoogleOauth2UserService googleOauth2UserService)
        {
            this.googleOauth2UserService=googleOauth2UserService;
        }

        @Value("${app.frontend-url}")
        private String frontendUrl;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http,AuthenticationSuccessHandler oauth2SuccessHandler, AuthenticationFailureHandler oauth2FailureHandler )
        {
            http.csrf(csrf-> csrf.disable())
                    .cors(Customizer.withDefaults())
                    .sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                    .authorizeHttpRequests(auth-> auth.requestMatchers("/api/auth/login","/oauth2","/login/oauth2/**","/error","/api/payment/webhook").permitAll()
                            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                            .requestMatchers("/api/**").authenticated().anyRequest().permitAll())
                    .exceptionHandling(ex->ex.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                    .oauth2Login(oauth->oauth
                            .userInfoEndpoint(userInfo-> userInfo.oidcUserService(googleOauth2UserService))
                            .successHandler(oauth2SuccessHandler)
                            .failureHandler(oauth2FailureHandler))
                    .logout(logout-> logout.logoutUrl("/api/auth/logout")
                            .deleteCookies("BOOKMYSEAT")
                            .invalidateHttpSession(true)
                            .clearAuthentication(true));

            return  http.build();
        }

    @Bean
    AuthenticationSuccessHandler oauth2SuccessHandler(@Value("${app.frontend-url}") String frontendURL)
    {
        SimpleUrlAuthenticationSuccessHandler handler= new SimpleUrlAuthenticationSuccessHandler();
        handler.setDefaultTargetUrl(frontendURL+"/auth/callback");
        return handler;
    }


    @Bean
    AuthenticationFailureHandler oauth2FailureHandler(@Value("${app.frontend-url}") String frontendUrl)
    {
        SimpleUrlAuthenticationFailureHandler handler= new SimpleUrlAuthenticationFailureHandler();
        handler.setDefaultFailureUrl(frontendUrl+"/login?error=oauth_failed");
        return handler;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(frontendUrl)
        );

        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }



}
