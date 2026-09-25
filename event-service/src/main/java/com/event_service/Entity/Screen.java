package com.event_service.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(
        name = "screens",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_venue_screen_name", columnNames = {"venue_id", "name"})
        },
        indexes = {
                @Index(name = "idx_screens_venue_id", columnList = "venue_id")
        }
)
public class Screen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "screen_id")
    private Long screenId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "format", nullable = false, length = 30)
    private String format = "2D";

    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats = 0;

    @Column(name = "total_rows", nullable = false)
    private Integer totalRows;

    @Column(name = "total_columns", nullable = false)
    private Integer totalColumns;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    void createdAt()
    {
        if(createdAt==null) createdAt=OffsetDateTime.now();

        updatedAt=OffsetDateTime.now();
    }

}