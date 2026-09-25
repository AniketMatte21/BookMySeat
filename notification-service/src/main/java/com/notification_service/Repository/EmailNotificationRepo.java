package com.notification_service.Repository;

import com.notification_service.Entity.EmailNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailNotificationRepo extends JpaRepository<EmailNotification,Long>
{
    boolean existsByBookingId(String BookingId);
}
