package com.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 100)
    private String orderTrackingNumber;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;
    
    @Column(nullable = false)
    private int totalQuantity;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;
    
    @Column(nullable = false)
    private LocalDateTime dateCreated;
    
    @Column(nullable = false)
    private LocalDateTime lastUpdated;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<OrderItem> orderItems;
    
    // Shipping Address
    @Column(length = 200)
    private String shippingAddress;
    
    @Column(length = 100)
    private String shippingCity;
    
    @Column(length = 50)
    private String shippingState;
    
    @Column(length = 20)
    private String shippingCountry;
    
    @Column(length = 20)
    private String shippingZipCode;
    
    // Billing Address
    @Column(length = 200)
    private String billingAddress;
    
    @Column(length = 100)
    private String billingCity;
    
    @Column(length = 50)
    private String billingState;
    
    @Column(length = 20)
    private String billingCountry;
    
    @Column(length = 20)
    private String billingZipCode;
    
    @PrePersist
    protected void onCreate() {
        dateCreated = LocalDateTime.now();
        lastUpdated = LocalDateTime.now();
        if (orderTrackingNumber == null) {
            orderTrackingNumber = generateTrackingNumber();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
    
    private String generateTrackingNumber() {
        return "ORD-" + System.currentTimeMillis();
    }
    
    public enum OrderStatus {
        PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
    }
}
