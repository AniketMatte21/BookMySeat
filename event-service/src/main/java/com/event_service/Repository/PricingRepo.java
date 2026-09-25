package com.event_service.Repository;

import com.event_service.Entity.ShowPricing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PricingRepo extends JpaRepository<ShowPricing,Long> {

    Optional<ShowPricing> findByShow_ShowIdAndTier(Long showId, String tier);
    List<ShowPricing> findByShow_ShowId(Long showId);
    boolean existsByShow_ShowIdAndTier(Long showId, String tier);
}
