package com.event_service.Service;

import com.event_service.Dto.ShowPricingDto;
import com.event_service.Entity.Show;
import com.event_service.Entity.ShowPricing;
import com.event_service.Repository.PricingRepo;
import com.event_service.Repository.ShowRepo;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShowPricingService {

    private final PricingRepo showPricingRepo;
    private final ShowRepo showRepo;
    @Transactional
    public List<ShowPricing> saveShowPricingList(List<ShowPricingDto> dtos) {
        List<ShowPricing> pricingEntities = new ArrayList<>();

        for (ShowPricingDto dto : dtos) {
            Long showId = dto.getShow().getShowId(); // adjust to getId() if your primary key is named id

            // 1. Fetch managed Show entity from the DB
            Show managedShow = showRepo.findById(showId)
                    .orElseThrow(() -> new NotFoundException("Show not found with id: " + showId));

            // 2. Map DTO to Entity (or update if already exists)
            ShowPricing pricing = showPricingRepo.findByShow_ShowIdAndTier(showId, dto.getTier())
                    .orElseGet(ShowPricing::new);

            pricing.setShow(managedShow);
            pricing.setTier(dto.getTier());
            pricing.setBasePrice(dto.getBasePrice());
            pricing.setConvenienceFee(
                    dto.getConvenienceFee() != null ? dto.getConvenienceFee() : BigDecimal.ZERO
            );
            pricing.setCurrency(
                    dto.getCurrency() != null ? dto.getCurrency() : "INR"
            );

            pricingEntities.add(pricing);
        }

        return showPricingRepo.saveAll(pricingEntities);
    }

    public List<ShowPricing> getPricingByShow(Long showId) {
        return showPricingRepo.findByShow_ShowId(showId);
    }
}
