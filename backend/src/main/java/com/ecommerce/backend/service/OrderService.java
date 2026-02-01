package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.OrderRequest;
import com.ecommerce.backend.model.*;
import com.ecommerce.backend.repository.NotificationRepository;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

        private final OrderRepository orderRepository;
        private final ProductRepository productRepository;
        private final UserRepository userRepository;
        private final NotificationRepository notificationRepository;

        @Transactional
        public Order placeOrder(OrderRequest request, Principal principal) {
                User user = userRepository.findByEmail(principal.getName())
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                BigDecimal totalAmount = BigDecimal.ZERO;
                List<OrderItem> orderItems = new ArrayList<>();

                Order order = Order.builder()
                                .user(user)
                                .shippingAddress(request.getShippingAddress())
                                .paymentMethod(request.getPaymentMethod())
                                .status(Order.OrderStatus.PENDING)
                                .totalAmount(BigDecimal.ZERO)
                                .items(new ArrayList<>())
                                .build();

                for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
                        Product product = productRepository.findById(itemReq.getProductId())
                                        .orElseThrow(() -> new EntityNotFoundException(
                                                        "Product not found: " + itemReq.getProductId()));

                        if (product.getStockQuantity() < itemReq.getQuantity()) {
                                throw new IllegalArgumentException(
                                                "Insufficient stock for product: " + product.getName());
                        }

                        // Deduct Stock
                        product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
                        productRepository.save(product);

                        // Create Order Item
                        OrderItem item = OrderItem.builder()
                                        .order(order)
                                        .product(product)
                                        .quantity(itemReq.getQuantity())
                                        .price(product.getPrice()) // Snapshot price
                                        .build();

                        orderItems.add(item);
                        totalAmount = totalAmount
                                        .add(product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity())));
                }

                order.setTotalAmount(totalAmount);
                order.getItems().addAll(orderItems);

                Order savedOrder = orderRepository.save(order);

                // Create Admin Notification
                createOrderNotification(savedOrder);

                return savedOrder;
        }

        private void createOrderNotification(Order order) {
                Notification notification = Notification.builder()
                                .message(
                                                "Order #" + order.getId() + " received from "
                                                                + order.getUser().getEmail() + ". Total: $"
                                                                + order.getTotalAmount())
                                .type("NEW_ORDER")
                                .targetId(order.getId())
                                .isRead(false)
                                .build();
                notificationRepository.save(notification);
                log.info("Admin notification created for Order ID: {}", order.getId());
        }

        public List<Order> getUserOrders(Principal principal) {
                User user = userRepository.findByEmail(principal.getName())
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
                return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        }

        public List<Order> getAllOrders() {
                return orderRepository.findAllByOrderByCreatedAtDesc();
        }

        /**
         * Update the status of an existing order.
         * Creates a notification for the order's user about the status change.
         *
         * @param orderId   The ID of the order to update
         * @param newStatus The new status to set
         * @return The updated order
         * @throws EntityNotFoundException if the order is not found
         */
        @Transactional
        public Order updateOrderStatus(Long orderId, Order.OrderStatus newStatus) {
                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new EntityNotFoundException("Order not found: " + orderId));

                Order.OrderStatus oldStatus = order.getStatus();
                order.setStatus(newStatus);
                Order savedOrder = orderRepository.save(order);

                // Create notification for the user about status change
                createStatusChangeNotification(savedOrder, oldStatus, newStatus);

                log.info("Order #{} status changed from {} to {}", orderId, oldStatus, newStatus);
                return savedOrder;
        }

        /**
         * Creates a notification for the user when their order status changes.
         */
        private void createStatusChangeNotification(Order order, Order.OrderStatus oldStatus,
                        Order.OrderStatus newStatus) {
                String message = String.format(
                                "Your order #%d has been updated from %s to %s.",
                                order.getId(), oldStatus, newStatus);

                Notification notification = Notification.builder()
                                .user(order.getUser())
                                .message(message)
                                .type("ORDER_STATUS_UPDATE")
                                .targetId(order.getId())
                                .isRead(false)
                                .build();

                notificationRepository.save(notification);
                log.info("User notification created for Order #{} status change", order.getId());
        }
}
