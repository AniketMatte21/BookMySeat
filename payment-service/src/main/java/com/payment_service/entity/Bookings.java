package com.payment_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "bookings",
uniqueConstraints = {
        @UniqueConstraint(name = "unique_show_seat", columnNames = {"showId", "seatId"})

})
public class Bookings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String bookingId;


    private String productName;

    private Long seatId;

    private String userId;

    private Long showId;

    private Double totalAmount;

    private Long quantity;

    private String currency;

    private OrderStatus orderStatus;

    private String sessionId;

    private LocalDateTime createdAt;

    @PrePersist
    void createdAt()
    {
        if(createdAt==null) createdAt=LocalDateTime.now();
    }






}
