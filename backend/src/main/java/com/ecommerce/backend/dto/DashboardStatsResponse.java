package com.ecommerce.backend.dto;

import java.math.BigDecimal;

/**
 * Java 21 Record for Dashboard Statistics.
 *
 * PERFORMANCE GAIN:
 * - Immutable by default (thread-safe without synchronization)
 * - No boilerplate: auto-generates equals(), hashCode(), toString()
 * - Smaller bytecode footprint than @Data classes
 * - Better JVM optimization for value-based classes
 */
public record DashboardStatsResponse(
    long totalProducts,
    long totalCategories,
    BigDecimal totalInventoryValue,
    long totalOrders
) {
    /**
     * Compact constructor for validation if needed
     */
    public DashboardStatsResponse {
        if (totalProducts < 0 || totalCategories < 0 || totalOrders < 0) {
            throw new IllegalArgumentException("Stats cannot be negative");
        }
        if (totalInventoryValue == null) {
            totalInventoryValue = BigDecimal.ZERO;
        }
    }
}
