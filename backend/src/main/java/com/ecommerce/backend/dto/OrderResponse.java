package com.ecommerce.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.ecommerce.backend.model.Order;
import com.ecommerce.backend.model.OrderItem;

/**
 * Java 21 Record for Order API responses.
 *
 * PERFORMANCE GAIN:
 * - Immutable: safe for caching
 * - Nested records for structured responses
 * - Explicit field selection prevents over-fetching
 */
public record OrderResponse(
    Long id,
    UserInfo user,
    BigDecimal totalAmount,
    String shippingAddress,
    String status,
    String paymentMethod,
    LocalDateTime createdAt,
    List<OrderItemInfo> items
) {
    /**
     * Nested record for user info (only non-sensitive fields)
     */
    public record UserInfo(
        Long id,
        String firstName,
        String lastName,
        String email
    ) {}

    /**
     * Nested record for order items with product details
     */
    public record OrderItemInfo(
        Long id,
        ProductInfo product,
        Integer quantity,
        BigDecimal price
    ) {}

    /**
     * Nested record for product info in order context
     */
    public record ProductInfo(
        Long id,
        String name,
        List<String> imageUrls
    ) {}

    /**
     * Factory method to convert Entity to Record
     * Safely handles lazy-loaded associations
     */
    public static OrderResponse from(Order order) {
        return new OrderResponse(
            order.getId(),
            new UserInfo(
                order.getUser().getId(),
                order.getUser().getFirstName(),
                order.getUser().getLastName(),
                order.getUser().getEmail()
            ),
            order.getTotalAmount(),
            order.getShippingAddress(),
            order.getStatus().name(),
            order.getPaymentMethod(),
            order.getCreatedAt(),
            order.getItems().stream()
                .map(OrderResponse::toItemInfo)
                .toList()
        );
    }

    private static OrderItemInfo toItemInfo(OrderItem item) {
        return new OrderItemInfo(
            item.getId(),
            new ProductInfo(
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getImageUrls()
            ),
            item.getQuantity(),
            item.getPrice()
        );
    }
}
