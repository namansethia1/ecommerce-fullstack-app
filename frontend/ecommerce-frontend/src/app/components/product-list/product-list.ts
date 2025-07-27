import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService, ProductResponse } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product, Category } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  searchKeyword = '';
  selectedCategory = '';
  loading = false;
  currentPage = 0;
  totalPages = 0;
  pageSize = 12;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    
    // Subscribe to query parameters
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || '';
      this.currentPage = 0;
      // Clear search when navigating to a category
      if (this.selectedCategory) {
        this.searchKeyword = '';
        this.filterByCategory();
      } else {
        this.loadProducts();
      }
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts(this.currentPage, this.pageSize).subscribe({
      next: (response: ProductResponse) => {
        this.products = response.content;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  searchProducts(): void {
    if (this.searchKeyword.trim()) {
      this.loading = true;
      this.currentPage = 0;
      this.productService.searchProducts(this.searchKeyword, this.currentPage, this.pageSize).subscribe({
        next: (response: ProductResponse) => {
          this.products = response.content;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching products:', error);
          this.loading = false;
        }
      });
    } else {
      this.loadProducts();
    }
  }

  filterByCategory(): void {
    this.currentPage = 0;
    if (this.selectedCategory) {
      this.loading = true;
      this.productService.getProductsByCategory(+this.selectedCategory, this.currentPage, this.pageSize).subscribe({
        next: (response: ProductResponse) => {
          this.products = response.content;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error filtering products:', error);
          this.loading = false;
        }
      });
    } else {
      this.loadProducts();
    }
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1).subscribe({
      next: (result) => {
        console.log('Product added to cart:', product.name);
        // Refresh the current view to show updated stock
        if (this.selectedCategory) {
          this.filterByCategory();
        } else if (this.searchKeyword.trim()) {
          this.searchProducts();
        } else {
          this.loadProducts();
        }
        // You could add a toast notification here
        alert(result.message);
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        alert(error.message || 'Failed to add product to cart');
      }
    });
  }

  viewProductDetails(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      if (this.selectedCategory) {
        this.filterByCategory();
      } else if (this.searchKeyword.trim()) {
        this.searchProducts();
      } else {
        this.loadProducts();
      }
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(0, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible);
    
    if (end - start < maxVisible) {
      start = Math.max(0, end - maxVisible);
    }
    
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
  }
}
