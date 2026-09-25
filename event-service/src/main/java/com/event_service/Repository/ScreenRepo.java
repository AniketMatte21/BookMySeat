package com.event_service.Repository;

import com.event_service.Entity.Screen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScreenRepo extends JpaRepository<Screen,Long> {
}
