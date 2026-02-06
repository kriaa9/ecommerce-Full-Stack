package com.ecommerce.backend.controller;

import com.ecommerce.backend.model.Notification;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.NotificationRepository;
import com.ecommerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

/**
 * Controller for user-specific notifications.
 * Allows authenticated users to view and manage their own notifications.
 */
@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class UserNotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    /**
     * Get all notifications for the currently authenticated user.
     * Sorted by creation date descending (newest first).
     */
    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(Principal principal) {
        User user = getUserFromPrincipal(principal);
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return ResponseEntity.ok(notifications);
    }

    /**
     * Get the count of unread notifications for the current user.
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(Principal principal) {
        User user = getUserFromPrincipal(principal);
        long count = notificationRepository.countByUserIdAndIsReadFalse(user.getId());
        return ResponseEntity.ok(count);
    }

    /**
     * Mark a specific notification as read.
     * Only the owner of the notification can mark it as read.
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, Principal principal) {
        User user = getUserFromPrincipal(principal);
        notificationRepository.markReadByIdAndOwner(id, user.getId());
        return ResponseEntity.ok().build();
    }

    private User getUserFromPrincipal(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
