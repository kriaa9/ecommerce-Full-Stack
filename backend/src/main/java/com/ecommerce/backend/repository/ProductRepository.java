package com.ecommerce.backend.repository;

import java.util.List;
import java.util.Optional;

import com.ecommerce.backend.model.Product;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Product Repository with optimized N+1 prevention queries.
 *
 * @EntityGraph eagerly fetches Category to prevent N+1 queries.
 * This is critical for Supabase/PgBouncer since each lazy load
 * would require a separate connection from the pool.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsBySku(String sku);

    /**
     * Find all products with category eagerly loaded (N+1 fix).
     */
    @EntityGraph(attributePaths = {"category"})
    @Query("SELECT p FROM Product p")
    List<Product> findAllWithCategory();

    /**
     * Find all active products with category eagerly loaded (N+1 fix).
     * Uses database-level filtering instead of Java stream filter.
     */
    @EntityGraph(attributePaths = {"category"})
    @Query("SELECT p FROM Product p WHERE p.active = true")
    List<Product> findAllActiveWithCategory();

    /**
     * Find a product by ID with category eagerly loaded (N+1 fix).
     */
    @EntityGraph(attributePaths = {"category"})
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findWithCategoryById(Long id);
}
