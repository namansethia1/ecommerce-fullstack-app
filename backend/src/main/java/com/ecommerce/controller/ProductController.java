package com.ecommerce.controller;

import com.ecommerce.entity.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> products = productRepository.findAll(pageable);
        
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<Product>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.findActiveByCategoryId(categoryId, pageable);
        
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Product>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.findByNameContainingIgnoreCase(keyword, pageable);
        
        return ResponseEntity.ok(products);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        Product savedProduct = productRepository.save(product);
        return ResponseEntity.ok(savedProduct);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody Product productDetails) {
        Optional<Product> productOpt = productRepository.findById(id);
        
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setSku(productDetails.getSku());
            product.setName(productDetails.getName());
            product.setDescription(productDetails.getDescription());
            product.setUnitPrice(productDetails.getUnitPrice());
            product.setImageUrl(productDetails.getImageUrl());
            product.setActive(productDetails.isActive());
            product.setUnitsInStock(productDetails.getUnitsInStock());
            product.setCategory(productDetails.getCategory());
            
            Product updatedProduct = productRepository.save(product);
            return ResponseEntity.ok(updatedProduct);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/decrease-stock")
    public ResponseEntity<?> decreaseProductStock(@PathVariable Long id, @RequestParam int quantity) {
        Optional<Product> productOpt = productRepository.findById(id);
        
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            
            if (product.getUnitsInStock() >= quantity) {
                product.setUnitsInStock(product.getUnitsInStock() - quantity);
                productRepository.save(product);
                return ResponseEntity.ok().body("{\"message\": \"Stock decreased successfully\"}");
            } else {
                return ResponseEntity.badRequest().body("{\"error\": \"Insufficient stock\"}");
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/increase-stock")
    public ResponseEntity<?> increaseProductStock(@PathVariable Long id, @RequestParam int quantity) {
        Optional<Product> productOpt = productRepository.findById(id);
        
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setUnitsInStock(product.getUnitsInStock() + quantity);
            productRepository.save(product);
            return ResponseEntity.ok().body("{\"message\": \"Stock increased successfully\"}");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
