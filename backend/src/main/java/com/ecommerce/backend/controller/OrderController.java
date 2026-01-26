package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.OrderRequest;
import com.ecommerce.backend.model.Order;
import com.ecommerce.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest request, Principal principal) {
        return ResponseEntity.ok(orderService.placeOrder(request, principal));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(Principal principal) {
        return ResponseEntity.ok(orderService.getUserOrders(principal));
    }
}
