package com.notification_service.kafka.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.notification_service.Dto.EmailNotificationDto;
import com.notification_service.Service.EmailNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.KafkaListener;

import java.math.BigDecimal;

@Configuration
public class KafkaConfig
{
        @Autowired
        private EmailNotificationService emailNotificationService;
        @Autowired
        private ObjectMapper objectMapper;

        @KafkaListener(topics=AppConstants.TOPIC_NAME,groupId=AppConstants.groupId)
        public void getTicketDetails(String json)
        {

            try{
                JsonNode message=objectMapper.readTree(json);

                String showName=String.valueOf(message.get("showName"));
                String userEmail=String.valueOf(message.get("userEmail"));
                String bookingId =String.valueOf( message.get("bookingId"));
                String userId=String.valueOf(message.get("userId"));
                String pricePaid=String.valueOf(message.get("pricePaid"));

                EmailNotificationDto emailNotificationDto=new EmailNotificationDto();
                emailNotificationDto.setBookingId(bookingId);
                emailNotificationDto.setPricePaid(pricePaid);
                emailNotificationDto.setShowName(showName);
                emailNotificationDto.setUserEmail(userEmail);
                emailNotificationDto.setUserId(userId);

                emailNotificationService.sendMail(emailNotificationDto);


                System.out.println("booking_id: "+bookingId +" "+ "user_id: "+userId+" "+"price_paid: "+pricePaid);
            }catch (JsonProcessingException e)
            {
                e.printStackTrace();
            }

            //        private Long showName;
//        private String bookingId;
//        private BigDecimal pricePaid;
//        private String userId;
//        private String userEmail;



        }
}
