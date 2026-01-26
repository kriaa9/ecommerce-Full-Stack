package com.ecommerce.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class ProductResponse {
    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotBlank(message = "SKU is required")
    private String sku;

    @NotNull(message = "Price is required")
    @Min(0)
    private BigDecimal price;

    private BigDecimal discountPrice;

    @NotNull(message = "Stock quantity is required")
    @Min(0)
    private Integer stockQuantity;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private Boolean active;
}
