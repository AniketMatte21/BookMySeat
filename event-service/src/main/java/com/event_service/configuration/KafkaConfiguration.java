package com.event_service.configuration;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfiguration
{
    @Bean
    public NewTopic topic()
    {
        return TopicBuilder.name(AppConstants.KAFKA_TOPIC_NAME).build();
//                .partitions(2)
//                .replicas(2).build();
    }
}
