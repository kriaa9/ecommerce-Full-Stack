package com.ecommerce.backend.repository;

import java.util.List;
import java.util.Optional;

import com.ecommerce.backend.model.Order;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Order Repository with optimized N+1 prevention queries.
 *
 * @EntityGraph eagerly fetches related entities to prevent N+1 queries.
 * Order -> OrderItems -> Product -> Category chain is fetched in single query.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Legacy methods (kept for backward compatibility if needed)
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Order> findAllByOrderByCreatedAtDesc();

    /**
     * Find user orders with items and products eagerly loaded (N+1 fix).
     */
    @EntityGraph(attributePaths = {"items", "items.product", "items.product.category"})
    @Query("SELECT o FROM Order o WHERE o.user.id = :userId ORDER BY o.createdAt DESC")
    List<Order> findByUserIdWithItemsOrderByCreatedAtDesc(Long userId);

    /**
     * Find all orders with items and products eagerly loaded (N+1 fix).
     * For admin dashboard.
     */
    @EntityGraph(attributePaths = {"user", "items", "items.product", "items.product.category"})
    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    List<Order> findAllWithItemsOrderByCreatedAtDesc();

    /**
     * Find order by ID with full details (N+1 fix).
     */
    @EntityGraph(attributePaths = {"user", "items", "items.product", "items.product.category"})
    @Query("SELECT o FROM Order o WHERE o.id = :id")
    Optional<Order> findWithDetailsById(Long id);
}
