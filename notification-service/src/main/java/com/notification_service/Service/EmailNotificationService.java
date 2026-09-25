package com.notification_service.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.notification_service.Dto.EmailNotificationDto;
import com.notification_service.Entity.EmailNotification;
import com.notification_service.Repository.EmailNotificationRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailNotificationService
{
    private final MailSender mailSender;
    private final SimpleMailMessage templateMessage;
    private final EmailNotificationRepo emailNotificationRepo;

    @Transactional
    public void sendMail(EmailNotificationDto emailNotificationDto)
    {

        boolean b = emailNotificationRepo.existsByBookingId(emailNotificationDto.getBookingId());
        if(b) throw new RuntimeException("Duplicate entry for bookingid: "+emailNotificationDto.getBookingId());

        EmailNotification emailNotification=new EmailNotification();
        emailNotification.setBookingId(emailNotificationDto.getBookingId());
        emailNotification.setUserEmail(emailNotificationDto.getUserEmail());
        emailNotification.setUserId(emailNotificationDto.getUserId());

        emailNotificationRepo.save(emailNotification);

        SimpleMailMessage msg=new SimpleMailMessage(this.templateMessage);
        msg.setTo(emailNotificationDto.getUserEmail());
        msg.setText(
                "Dear user "+emailNotificationDto.getUserId()+
                        " you have successfully booked the ticket for "
                +emailNotificationDto.getShowName()+ " kindly refer the booking id "
                +emailNotificationDto.getBookingId()+ " and get your ticket inside the BookMySeat application."
                +" Do not panic if the ticket has not been generated after your payment, check the my_tickets section" +
                        "on the home page and download it" +
                        " Kindly carry the virtual/physical ticket to enter. " +
                        " regards BookMySeat"
        );

        try {
            this.mailSender.send(msg);
        }
        catch (MailException ex) {
            // simply log it and go on...
            System.err.println(ex.getMessage());
        }


    }

}
