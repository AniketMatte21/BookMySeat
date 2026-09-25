package com.payment_service.service;

import com.payment_service.dto.ProductRequest;
import com.payment_service.dto.StripeResponse;
import com.payment_service.entity.Bookings;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.stripe.Stripe;
import com.stripe.model.Account;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StripeService {

    @Value("${stripe.secret.key}")
    private String secretKey;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    private final BookingService bookingService;


    public StripeResponse checkoutProducts(ProductRequest productRequest,String userId) {
        // Set your secret key. Remember to switch to your live secret key in production!
        Stripe.apiKey = secretKey;

        // Create a PaymentIntent with the order amount and currency
        SessionCreateParams.LineItem.PriceData.ProductData productData =
                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                        .setName(productRequest.getProductName())
                        .build();

        // Create new line item with the above product data and associated price
        SessionCreateParams.LineItem.PriceData priceData =
                SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency(productRequest.getCurrency() != null ? productRequest.getCurrency() : "USD")
                        .setUnitAmount(productRequest.getAmount()*100)
                        .setProductData(productData)
                        .build();

        // Create new line item with the above price data
        SessionCreateParams.LineItem lineItem =
                SessionCreateParams
                        .LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(priceData)
                        .build();

        // Create new session with the line items
        String bookingId= UUID.randomUUID().toString();
        SessionCreateParams params =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setSuccessUrl(frontendUrl+"/success")
                        .setCancelUrl(frontendUrl+"/cancel")
                        .addLineItem(lineItem)
                        .putMetadata("userId", userId)
                        .putMetadata("bookingId",bookingId)
                .putMetadata("showId", String.valueOf(productRequest.getShowId()))
                        .putMetadata("token", productRequest.getToken())
                .putMetadata("seats", String.join(",", productRequest.getSeats().stream().map(String::valueOf).toList()))
                        .build();

        // Create new session
        Session session = null;
        try {
            session = Session.create(params);
        } catch (StripeException e) {
            e.printStackTrace();
            throw new RuntimeException("Stripe session creation failed", e);
            //log the error
        }


        assert session != null;
        return StripeResponse
                .builder()
                .status("SUCCESS")
                .message("Payment session created ")
                .sessionId(session.getId())
                .sessionUrl(session.getUrl())
                .bookingId(bookingId)
                .build();
    }

    @PostConstruct
    public void verifyStripeAccount() {
        try {
            // Retrieves the account details for the configured Stripe.apiKey
            Account account = Account.retrieve();
            System.out.println("==========================================");
            System.out.println(" Connected Stripe Account: " + account.getId());
            System.out.println(" Business Name: " + account.getBusinessProfile().getName());
            System.out.println("==========================================");
        } catch (Exception e) {
            System.err.println(" Failed to connect to Stripe: " + e.getMessage());
        }
    }
}
