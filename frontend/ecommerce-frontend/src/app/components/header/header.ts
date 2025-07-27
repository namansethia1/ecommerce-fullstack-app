import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { User } from '../../models/auth.model';
import { Category } from '../../models/product.model';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isLoggedIn = false;
  isAdmin = false;
  cartItemCount = 0;
  categories: Category[] = [];
  
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication state
    this.subscriptions.push(
      this.authService.currentUser.subscribe(user => {
        this.currentUser = user;
        this.isLoggedIn = !!user;
        this.isAdmin = this.authService.isAdmin();
      })
    );

    // Subscribe to cart updates
    this.subscriptions.push(
      this.cartService.totalQuantity$.subscribe(count => {
        this.cartItemCount = count;
      })
    );

    // Load categories
    this.loadCategories();
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

  navigateToCategory(categoryId: number): void {
    this.router.navigate(['/products'], { 
      queryParams: { category: categoryId } 
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  logout(): void {
    this.authService.logout();
  }
}
