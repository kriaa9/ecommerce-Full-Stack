package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProductRequest;
import com.ecommerce.backend.model.Category;
import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.model.User;
import com.ecommerce.backend.repository.CategoryRepository;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final CloudinaryService cloudinaryService;

    // --- READ OPERATIONS ---

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getAllActiveProducts() {
        // We filter stream to return ONLY active products to the public catalog
        return productRepository.findAll().stream()
                .filter(product -> Boolean.TRUE.equals(product.getActive()))
                .collect(Collectors.toList());
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with ID: " + id));
    }

    // --- WRITE OPERATIONS (Admin) ---

    @Transactional
    public Product createProduct(ProductRequest request, List<MultipartFile> images, Principal principal)
            throws IOException {

        if (productRepository.existsBySku(request.getSku())) {
            throw new IllegalArgumentException("Product with SKU " + request.getSku() + " already exists");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(
                        () -> new EntityNotFoundException("Category not found with ID: " + request.getCategoryId()));

        User admin = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        log.info("Creating product: {} with {} images", request.getName(), (images != null ? images.size() : 0));
        List<String> imageUrls = new ArrayList<>();
        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                if (!file.isEmpty()) {
                    Map<String, String> uploadResult = cloudinaryService.uploadImage(file, "products");
                    imageUrls.add(uploadResult.get("url"));
                }
            }
        }

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .sku(request.getSku())
                .price(request.getPrice())
                .discountPrice(request.getDiscountPrice())
                .stockQuantity(request.getStockQuantity())
                .active(request.getActive() != null ? request.getActive() : true)
                .category(category)
                .createdBy(admin)
                .imageUrls(imageUrls)
                .build();

        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, ProductRequest request, List<MultipartFile> images) throws IOException {
        Product product = getProductById(id);

        if (request.getName() != null)
            product.setName(request.getName());
        if (request.getDescription() != null)
            product.setDescription(request.getDescription());
        if (request.getPrice() != null)
            product.setPrice(request.getPrice());
        if (request.getDiscountPrice() != null)
            product.setDiscountPrice(request.getDiscountPrice());
        if (request.getStockQuantity() != null)
            product.setStockQuantity(request.getStockQuantity());
        if (request.getActive() != null)
            product.setActive(request.getActive());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found"));
            product.setCategory(category);
        }

        // Handle new images if provided
        if (images != null && !images.isEmpty()) {
            List<String> newImageUrls = new ArrayList<>();
            for (MultipartFile file : images) {
                if (!file.isEmpty()) {
                    Map<String, String> uploadResult = cloudinaryService.uploadImage(file, "products");
                    newImageUrls.add(uploadResult.get("url"));
                }
            }
            if (!newImageUrls.isEmpty()) {
                product.setImageUrls(newImageUrls);
            }
        }

        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) throws IOException {
        Product product = getProductById(id);
        // Note: You can implement Cloudinary deletion logic here later
        productRepository.delete(product);
    }

    public com.ecommerce.backend.dto.DashboardStatsResponse getDashboardStats() {
        long totalProducts = productRepository.count();
        long totalCategories = categoryRepository.count();
        long totalOrders = orderRepository.count();

        List<Product> products = productRepository.findAll();
        java.math.BigDecimal totalValue = products.stream()
                .map(product -> product.getPrice().multiply(java.math.BigDecimal.valueOf(product.getStockQuantity())))
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        return com.ecommerce.backend.dto.DashboardStatsResponse.builder()
                .totalProducts(totalProducts)
                .totalCategories(totalCategories)
                .totalInventoryValue(totalValue)
                .totalOrders(totalOrders)
                .build();
    }
}