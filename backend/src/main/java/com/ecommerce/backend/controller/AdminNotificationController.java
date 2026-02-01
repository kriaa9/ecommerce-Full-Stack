package com.ecommerce.backend.controller;

import com.ecommerce.backend.model.Notification;
import com.ecommerce.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for admin/system-wide notifications.
 * These are notifications without a specific user (user is null).
 */
@RestController
@RequestMapping("/api/v1/admin/notifications")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminNotificationController {

    private final NotificationRepository notificationRepository;

    /**
     * Get all system-wide notifications (for admins).
     */
    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return ResponseEntity.ok(notificationRepository.findByUserIsNullOrderByCreatedAtDesc());
    }

    /**
     * Get count of unread system-wide notifications.
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount() {
        return ResponseEntity.ok(notificationRepository.countByUserIsNullAndIsReadFalse());
    }

    /**
     * Mark a system-wide notification as read.
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
        return ResponseEntity.ok().build();
    }
}
