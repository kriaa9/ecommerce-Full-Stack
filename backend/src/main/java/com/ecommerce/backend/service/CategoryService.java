package com.ecommerce.backend.service;

import java.util.List;

import com.ecommerce.backend.config.CacheConfig;
import com.ecommerce.backend.dto.CategoryRequest;
import com.ecommerce.backend.model.Category;
import com.ecommerce.backend.repository.CategoryRepository;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Category Service with Caffeine caching.
 *
 * CACHING STRATEGY:
 * - Categories are read-heavy, write-rare data
 * - Cache TTL: 1 hour (configured in CacheConfig)
 * - All write operations evict the entire cache
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {

    private final CategoryRepository categoryRepository;

    /**
     * Get all categories.
     *
     * PERFORMANCE GAIN:
     * - Cached for 1 hour (categories rarely change)
     * - Eliminates ~20ms DB query on cache hit
     */
    @Cacheable(value = CacheConfig.CATEGORIES_CACHE, key = "'all'")
    public List<Category> getAllCategories() {
        log.debug("Cache MISS: Fetching all categories from database");
        return categoryRepository.findAll();
    }

    /**
     * Create a new category.
     * Evicts cache to ensure consistency.
     */
    @CacheEvict(value = CacheConfig.CATEGORIES_CACHE, allEntries = true)
    public Category createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.name())) {
            throw new IllegalArgumentException("Category with this name already exists");
        }
        Category category = Category.builder()
                .name(request.name())
                .description(request.description())
                .build();
        log.info("Creating category: {}", request.name());
        return categoryRepository.save(category);
    }

    /**
     * Update an existing category.
     * Evicts all caches (products may reference this category).
     */
    @Caching(evict = {
        @CacheEvict(value = CacheConfig.CATEGORIES_CACHE, allEntries = true),
        @CacheEvict(value = CacheConfig.PRODUCTS_CACHE, allEntries = true)
    })
    public Category updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        category.setName(request.name());
        category.setDescription(request.description());
        log.info("Updating category: {} (ID: {})", request.name(), id);
        return categoryRepository.save(category);
    }

    /**
     * Delete a category.
     * Evicts all caches.
     */
    @Caching(evict = {
        @CacheEvict(value = CacheConfig.CATEGORIES_CACHE, allEntries = true),
        @CacheEvict(value = CacheConfig.PRODUCTS_CACHE, allEntries = true),
        @CacheEvict(value = CacheConfig.DASHBOARD_STATS_CACHE, allEntries = true)
    })
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new EntityNotFoundException("Category not found");
        }
        log.info("Deleting category ID: {}", id);
        categoryRepository.deleteById(id);
    }
}
