package com.payment_service.controller;

import com.payment_service.dto.ProductRequest;
import com.payment_service.dto.StripeResponse;
import com.payment_service.service.BookingService;
import com.payment_service.service.Clients.EventServiceClient;
import com.payment_service.service.StripeService;
import com.stripe.exception.EventDataObjectDeserializationException;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final StripeService stripeService;
    private final BookingService bookingService;


    @Value("${webhook.secret}")
    private String webhookSecret;

    @PostMapping("/checkout")
    public ResponseEntity<StripeResponse> checkoutProducts(@RequestBody ProductRequest productRequest,@RequestHeader("X-User-id") String userId) {
        System.out.println("ProductRequest = " + productRequest);
        System.out.println("userId = " + userId);

        StripeResponse stripeResponse = stripeService.checkoutProducts(productRequest,userId);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(stripeResponse);
    }

    //Webhook Event
//    POST /webhook
//    Content-Type: application/json
//    Stripe-Signature: t=...,v1=...
//
//    {
//        "id": "evt_123...",
//            "object": "event",
//            "type": "checkout.session.completed",
//            "data": {
//        "object": {
//            "id": "cs_test_123...",
//                    "payment_status": "paid"
//        }
//    }
//    }

    @PostMapping("/webhook")
    public ResponseEntity<String> webhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signature) throws EventDataObjectDeserializationException {

        Event event;
        try {
            event = Webhook.constructEvent(payload, signature, webhookSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.badRequest().body("Invalid webhook signature");
        }

        if ("checkout.session.completed".equals(event.getType())) {
            EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();
            StripeObject stripeObject = null;

            if (deserializer.getObject().isPresent()) {
                stripeObject = deserializer.getObject().get();
            } else {
                // Fallback: Deserializes the object even if API versions differ
                stripeObject = deserializer.deserializeUnsafe();
            }

            if (stripeObject instanceof Session) {
                Session session = (Session) stripeObject;

                if ("paid".equals(session.getPaymentStatus())) {
                    System.out.println("Payment successful for session: " + session.getId());
                    //run Redis Lua script to save key permanently in Redis

                    bookingService.saveSuccessfulOrder(session);


                    return ResponseEntity.ok("Payment successful");
                }
            } else {
                return ResponseEntity.badRequest().body("Payload object is not a checkout Session");
            }
        }

        return ResponseEntity.ok("Event Received");
    }
}
