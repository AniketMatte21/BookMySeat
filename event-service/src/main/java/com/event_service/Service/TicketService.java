package com.event_service.Service;

import com.event_service.Component.TicketGenerator;
import com.event_service.Dto.GenerateTicketResponse;
import com.event_service.Service.Clients.PaymentServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TicketService
{

    private final PaymentServiceClient paymentServiceClient;
    private final TicketGenerator ticketGenerator;

    public List<GenerateTicketResponse> getTicketsByUserId(String userId)
    {
        Set<String> bookingIds = paymentServiceClient.bookingId(userId);
        List<GenerateTicketResponse> list=new ArrayList<>();
        for(String bookingId:bookingIds)
        {
            GenerateTicketResponse generateTicketResponse = ticketGenerator.generateTicket(bookingId);
            list.add(generateTicketResponse);
        }

        return list;
    }
}
