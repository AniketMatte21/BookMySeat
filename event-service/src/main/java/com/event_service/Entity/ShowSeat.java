package com.event_service.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "show_seats",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_show_seat", columnNames = {"show_id", "seat_id"})
        }
)
public class ShowSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long showSeatId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "show_id", nullable = false)
    private Show show;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @Column(name = "booking_id", nullable = false)
    private String bookingId;

    @Column(name = "price_paid", nullable = false)
    private BigDecimal pricePaid;

    @CreationTimestamp
    private OffsetDateTime createdAt;

    @PrePersist
    void createdAt()
    {
        if(createdAt==null) createdAt=OffsetDateTime.now();
    }

    // constructors, getters, setters...
}