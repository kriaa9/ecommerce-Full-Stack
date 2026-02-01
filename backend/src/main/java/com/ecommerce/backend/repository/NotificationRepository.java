package com.ecommerce.backend.repository;

import com.ecommerce.backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Notification entity.
 * Provides methods for admin (system-wide) and user-specific notifications.
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /**
     * Find all admin/system-wide notifications (where user is null), ordered by
     * date descending.
     */
    List<Notification> findByUserIsNullOrderByCreatedAtDesc();

    /** Count unread admin/system-wide notifications. */
    long countByUserIsNullAndIsReadFalse();

    /** Find all notifications for a specific user, ordered by date descending. */
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    /** Count unread notifications for a specific user. */
    long countByUserIdAndIsReadFalse(Long userId);

    // Legacy methods for backward compatibility (if needed)
    List<Notification> findAllByOrderByCreatedAtDesc();

    long countByIsReadFalse();
}
