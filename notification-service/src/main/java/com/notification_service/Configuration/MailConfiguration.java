package com.notification_service.Configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class MailConfiguration {

    @Bean
    JavaMailSender mailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);
        mailSender.setUsername("aniketmatte10@gmail.com");
        mailSender.setPassword("ihnp lmzf xcro zmdm");
        mailSender.getJavaMailProperties().put(
                "mail.smtp.auth", "true"
        );

        mailSender.getJavaMailProperties().put(
                "mail.smtp.starttls.enable", "true"
        );

        return mailSender;
    }

    @Bean // this is a template message that we can pre-load with default state
    SimpleMailMessage templateMessage() {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("aniketmatte10@gmail.com");
        message.setSubject("BookMySeat- Ticket Confirmation");
        return message;
    }

}
