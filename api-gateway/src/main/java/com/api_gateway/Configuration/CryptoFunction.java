package com.api_gateway.Configuration;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.security.crypto.encrypt.TextEncryptor;

@Configuration
public class CryptoFunction
{
    @Bean
    public TextEncryptor textEncryptor(@Value("${app.text-encryptor-password}") String password, @Value("${app.text-encryptor-salt}")String salt)
    {
        return Encryptors.text(password,salt);
    }

}
