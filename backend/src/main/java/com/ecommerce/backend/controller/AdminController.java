package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.ProductRequest;
import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ProductService productService;

    // POST /api/v1/admin/products
    // Consumes "multipart/form-data" because we are uploading files + data
    @PostMapping(value = "/products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> createProduct(
            @RequestPart("product") ProductRequest productRequest, // JSON Data
            @RequestPart(value = "images", required = false) List<MultipartFile> images, // Files
            Principal principal
    ) {
        try {
            Product createdProduct = productService.createProduct(productRequest, images, principal);
            return ResponseEntity.ok(createdProduct);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}