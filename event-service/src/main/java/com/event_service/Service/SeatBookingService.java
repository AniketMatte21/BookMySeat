package com.event_service.Service;

import com.event_service.Component.KeyGenerator;
import com.event_service.Component.TicketGenerator;
import com.event_service.Dto.ConfirmedSeatDto;
import com.event_service.Dto.GenerateTicketResponse;
import com.event_service.Dto.MailSenderDto;
import com.event_service.Dto.RedisResponseDto;
import com.event_service.Entity.Seat;
import com.event_service.Entity.Show;
import com.event_service.Entity.ShowSeat;
import com.event_service.Repository.SeatRepo;
import com.event_service.Repository.ShowRepo;
import com.event_service.Repository.ShowSeatRepo;
import com.event_service.Service.Clients.UserServiceClient;
import com.event_service.Service.kafka.KafkaService;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SeatBookingService {

    private final ShowRepo showRepo;
    private final SeatRepo seatRepo;
    private final ShowSeatRepo showSeatRepo;
    private final TicketGenerator ticketGenerator;
    private final KafkaService kafkaService;
    private final UserServiceClient userServiceClient;

    private static final long TTL_MINUTES=10;
    private final KeyGenerator keyGenerator;
    private final RedisTemplate<String,Object> redisTemplate;
    private static final String ATOMIC_PERSIST_SCRIPT =
            "if redis.call('get', KEYS[1]) == ARGV[1] then " +
                    "    redis.call('persist', KEYS[1]); " +
                    "    return 1; " +
                    "else " +
                    "    return 0; " +
                    "end";

    //set key in Redis
    public RedisResponseDto setKey(Long showId, List<Long> seatId)
    {
        if(seatId.isEmpty())  throw new NotFoundException("Select seats to proceed");

        String randomId= UUID.randomUUID().toString(); //randomId=12422414983
        List<Long> alreadyLockedSeatId=new ArrayList<>();
        List<Long> generatedKeys=new ArrayList<>();

        //seats=[A1,A2,A3,A4]
        //case1: all seats available
        //return showId+randomId

        for(Long id: seatId)
        {
            String key = keyGenerator.generateKey(showId, id);
            Boolean isExist = redisTemplate.opsForValue().setIfAbsent(key, randomId, Duration.ofMinutes(10));
            if(!isExist) {
                alreadyLockedSeatId.add(id);
                continue;
            }
            generatedKeys.add(id);
        }

        if(!alreadyLockedSeatId.isEmpty())
        {
            for(Long id:generatedKeys)
            {
                String key=keyGenerator.generateKey(showId,id);
                if(redisTemplate.opsForValue().get(key).equals(randomId))   redisTemplate.delete(key);
            }

        }

        return alreadyLockedSeatId.isEmpty()? RedisResponseDto.builder().showId(showId).lockedSeatId(alreadyLockedSeatId).token(randomId).build():
                RedisResponseDto.builder().showId(showId).lockedSeatId(alreadyLockedSeatId).token(null).build();

    }

    // managedInternalSeatsAfterPayment

    //run Lua Script here
    public Boolean managedInternalSeats(Long showId, List<Long> seats, String token)
    {
        List<String> key=new ArrayList<>();
                for(Long seatId:seats)
                {
                    key.add( keyGenerator.generateKey(showId, seatId));
                }
                Long result = redisTemplate.execute(
                new DefaultRedisScript<>(ATOMIC_PERSIST_SCRIPT, Long.class),
                key,
                token
        );

                boolean confirmed= (result!=null && result==1);
                        return confirmed;

    }


    @Transactional
    public void saveConfirmSeats(ConfirmedSeatDto confirmedSeatDto)
    {
        Long showId = confirmedSeatDto.getShowId();

        List<ShowSeat> bookedSeats=new ArrayList<>();
        Show show = showRepo.findById(showId).orElseThrow();
        List<Long> seats = confirmedSeatDto.getSeats();
        for(Long seatId:seats)
        {
            Seat seat = seatRepo.findById(seatId).orElseThrow();
            ShowSeat showSeat=new ShowSeat();
            showSeat.setBookingId(confirmedSeatDto.getBookingId());
            showSeat.setPricePaid(confirmedSeatDto.getPricePaid());
            showSeat.setSeat(seat);
            showSeat.setShow(show);
            bookedSeats.add(showSeat);

        }

        showSeatRepo.saveAll(bookedSeats);
        //save booked seat in show_Seat table

        MailSenderDto mailSenderDto = mailSenderDto(confirmedSeatDto);

        //notify to email,sms,etc
        //push message to kafka
        kafkaService.sendTicketDetails(mailSenderDto);

    }

    //design mail sender dto
    public MailSenderDto mailSenderDto(ConfirmedSeatDto confirmedSeatDto)
    {
//        private Long showName;
//        private String bookingId;
//        private BigDecimal pricePaid;
//        private String userId;
//        private String userEmail;

        Long showId = confirmedSeatDto.getShowId();
        Show show = showRepo.findById(showId).orElseThrow();
        String showName = show.getEvent().getTitle();

        String userId = confirmedSeatDto.getUserId();
        String userMail = userServiceClient.getOwner(userId);

        return MailSenderDto.builder().showName(showName).bookingId(
                confirmedSeatDto.getBookingId()
        ).pricePaid(confirmedSeatDto.getPricePaid()).userId(userId).userEmail(userMail).build();

    }

}

