package com.event_service.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "events",
        indexes = {
                @Index(name = "idx_events_language", columnList = "language"),
                @Index(name = "idx_events_category", columnList = "category")
        }
)
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long eventId;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "category", nullable = false, length = 50)
    private String category = "MOVIE";

    @Column(name = "language", nullable = false, length = 50)
    private String language;

    @Column(name = "genre", nullable = false, length = 100)
    private String genre;

    @Column(name = "duration_mins", nullable = false)
    private Integer durationMins;

    @Column(name = "censor_rating", nullable = false, length = 10)
    private String censorRating;

    @Column(name = "release_date", nullable = false)
    private LocalDate releaseDate;

    @Column(name = "poster_url", nullable = false, length = 500)
    private String posterUrl;

    @Column(name = "banner_url", length = 500)
    private String bannerUrl;

    @Column(name = "trailer_url", length = 500)
    private String trailerUrl;

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