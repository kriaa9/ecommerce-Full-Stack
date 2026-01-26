package com.ecommerce.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class DashboardStatsResponse {
    private long totalProducts;
    private long totalCategories;
    private BigDecimal totalInventoryValue;
    private long totalOrders; // Placeholder for future
}
