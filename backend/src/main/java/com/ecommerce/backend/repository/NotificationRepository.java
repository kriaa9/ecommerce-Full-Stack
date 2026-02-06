package com.ecommerce.backend.repository;

import com.ecommerce.backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

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

    /**
     * Flip the read flag in a single UPDATE — avoids the SELECT-then-save round-trip
     * that the controllers were doing previously.
     */
    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.id = :notificationId AND n.isRead = false")
    int markReadById(@Param("notificationId") Long notificationId);

    /** Same as above but scoped to a specific user — enforces ownership. */
    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.id = :notificationId AND n.user.id = :ownerId AND n.isRead = false")
    int markReadByIdAndOwner(@Param("notificationId") Long notificationId, @Param("ownerId") Long ownerId);
}
