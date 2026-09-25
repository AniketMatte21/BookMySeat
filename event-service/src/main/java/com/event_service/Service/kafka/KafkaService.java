package com.event_service.Service.kafka;

import com.event_service.Dto.ConfirmedSeatDto;
import com.event_service.Dto.MailSenderDto;
import com.event_service.configuration.AppConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaService {

    @Autowired
    private KafkaTemplate<String,Object> kafkaTemplate;

    public boolean sendTicketDetails(MailSenderDto mailSenderDto)
    {
        kafkaTemplate.send(AppConstants.KAFKA_TOPIC_NAME,mailSenderDto);
        return true;
    }
}
