import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalPrice = 0;
  totalQuantity = 0;
  private subscriptions: Subscription[] = [];

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.cartService.cartItems$.subscribe(items => {
        this.cartItems = items;
      })
    );

    this.subscriptions.push(
      this.cartService.totalPrice$.subscribe(price => {
        this.totalPrice = price;
      })
    );

    this.subscriptions.push(
      this.cartService.totalQuantity$.subscribe(quantity => {
        this.totalQuantity = quantity;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  increaseQuantity(productId: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + 1).subscribe({
        next: (result) => {
          console.log('Quantity updated:', result.message);
        },
        error: (error) => {
          console.error('Error updating quantity:', error);
          alert(error.message || 'Failed to update quantity');
        }
      });
    }
  }

  decreaseQuantity(productId: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(productId, item.quantity - 1).subscribe({
        next: (result) => {
          console.log('Quantity updated:', result.message);
        },
        error: (error) => {
          console.error('Error updating quantity:', error);
          alert(error.message || 'Failed to update quantity');
        }
      });
    }
  }

  removeFromCart(productId: number): void {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      this.cartService.removeFromCart(productId).subscribe({
        next: (result) => {
          console.log('Item removed:', result.message);
        },
        error: (error) => {
          console.error('Error removing item:', error);
          alert(error.message || 'Failed to remove item');
        }
      });
    }
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      this.cartService.clearCart().subscribe({
        next: (result) => {
          console.log('Cart cleared:', result.message);
        },
        error: (error) => {
          console.error('Error clearing cart:', error);
          alert(error.message || 'Failed to clear cart');
        }
      });
    }
  }

  getFinalTotal(): number {
    const shipping = this.totalPrice > 50 ? 0 : 5.99;
    const tax = this.totalPrice * 0.08;
    return this.totalPrice + shipping + tax;
  }

  canProceedToCheckout(): boolean {
    return this.cartItems.length > 0 && this.authService.isLoggedIn();
  }

  proceedToCheckout(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
    }
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
  }
}
