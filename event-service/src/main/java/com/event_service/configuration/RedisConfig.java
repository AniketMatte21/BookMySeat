package com.event_service.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializer;


@Configuration
public class RedisConfig {

    @Value("${spring.data.redis.host:localhost}")
    private String host;

    @Value("${spring.data.redis.port:6379}")
    private int port;




    //Connecting the Jedis Client with the redis
    @Bean
    public JedisConnectionFactory redisConnectionFactory()
    {
        RedisStandaloneConfiguration configuration= new RedisStandaloneConfiguration();

        configuration.setHostName(host);
        configuration.setPort(port);

        return new JedisConnectionFactory(configuration);


    }

    //RedisTemplate:- for querying the redis commands to redis
    @Bean
    public RedisTemplate<String,Object> redisTemplate(JedisConnectionFactory jedisConnectionFactory)
    {
        RedisTemplate<String,Object> redisTemplate=new RedisTemplate<>();
        //get jedisClient Connection
        redisTemplate.setConnectionFactory(jedisConnectionFactory);

        //Config key serializer
        redisTemplate.setKeySerializer(RedisSerializer.string());
        redisTemplate.setHashKeySerializer(RedisSerializer.string());

        //config value serializer
        redisTemplate.setValueSerializer(RedisSerializer.json());
        redisTemplate.setHashValueSerializer(RedisSerializer.json());

        return redisTemplate;




    }
}
