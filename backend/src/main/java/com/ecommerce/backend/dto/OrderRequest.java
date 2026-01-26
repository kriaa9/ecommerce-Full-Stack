package com.ecommerce.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private String shippingAddress;
    private String paymentMethod;
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
    }
}
