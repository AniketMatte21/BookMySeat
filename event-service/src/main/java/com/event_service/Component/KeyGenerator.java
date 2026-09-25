package com.event_service.Component;

import org.springframework.stereotype.Component;

import java.util.StringJoiner;

@Component
public class KeyGenerator {

    private static final String PREFIX= "seat:booking";

    public String generatePattern()
    {
        return PREFIX+ ":*";
    }

    // only add value if not null
    public void addIfNotNull(StringJoiner stringJoiner,String key,Object value)
    {
        if(value!=null) stringJoiner.add(key + "=" +value);
    }
    //seat:booking:showId=101:seatId=1
    public String generateKey(Long showId , Long seatId)
    {
        StringJoiner stringJoiner=new StringJoiner(":");

        stringJoiner.add(PREFIX);
        addIfNotNull(stringJoiner, "showId", showId);
        addIfNotNull(stringJoiner, "seatId", seatId);
        return stringJoiner.toString();

    }








}
