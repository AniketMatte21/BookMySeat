package com.event_service.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(
        name = "seats",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_screen_seat", columnNames = {"screen_id", "row_identifier", "seat_number"})
        },
        indexes = {
                @Index(name = "idx_seats_screen_id", columnList = "screen_id")
        }
)
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_id")
    private Long seatId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "screen_id", nullable = false)
    private Screen screen;

    @Column(name = "row_identifier", nullable = false, length = 5)
    private String rowIdentifier;

    @Column(name = "seat_number", nullable = false)
    private Integer seatNumber;

    @Column(name = "tier", nullable = false, length = 20)
    private String tier;

    @Column(name = "grid_row", nullable = false)
    private Integer gridRow;

    @Column(name = "grid_column", nullable = false)
    private Integer gridColumn;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

}