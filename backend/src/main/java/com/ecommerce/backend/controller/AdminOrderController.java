package com.ecommerce.backend.controller;

import com.ecommerce.backend.model.Order;
import com.ecommerce.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Admin controller for managing customer orders.
 * All endpoints require ADMIN role.
 */
@RestController
@RequestMapping("/api/v1/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final OrderService orderService;

    /**
     * Get all customer orders, sorted by date descending.
     */
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    /**
     * Update the status of an order.
     * Expects a JSON body with a "status" field containing the new status string.
     * Valid statuses: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
     *
     * @param id      The order ID
     * @param payload Map containing "status" key
     * @return The updated order
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String statusStr = payload.get("status");
        Order.OrderStatus newStatus = Order.OrderStatus.valueOf(statusStr.toUpperCase());
        Order updatedOrder = orderService.updateOrderStatus(id, newStatus);
        return ResponseEntity.ok(updatedOrder);
    }
}
