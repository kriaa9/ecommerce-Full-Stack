package com.ecommerce.backend.dto;

import com.ecommerce.backend.model.Category;

/**
 * Java 21 Record for Category API responses.
 *
 * PERFORMANCE GAIN:
 * - Immutable: safe for caching and concurrent access
 * - Automatic serialization with Jackson
 * - No reflection overhead for getters
 */
public record CategoryResponse(
    Long id,
    String name,
    String description,
    String imageUrl
) {
    /**
     * Factory method to convert Entity to Record
     */
    public static CategoryResponse from(Category category) {
        return new CategoryResponse(
            category.getId(),
            category.getName(),
            category.getDescription(),
            category.getImageUrl()
        );
    }
}
