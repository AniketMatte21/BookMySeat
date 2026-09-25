package com.event_service.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "show_pricing",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_show_tier_pricing", columnNames = {"show_id", "tier"})
        },
        indexes = {
                @Index(name = "idx_pricing_show_id", columnList = "show_id")
        }
)
public class ShowPricing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pricing_id")
    private Long pricingId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "show_id", nullable = false)
    private Show show;

    @Column(name = "tier", nullable = false, length = 30)
    private String tier;

    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "convenience_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal convenienceFee = BigDecimal.ZERO;

    @Column(name = "currency", nullable = false, length = 5)
    private String currency = "INR";

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