import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();
  
  private totalPriceSubject = new BehaviorSubject<number>(0);
  public totalPrice$ = this.totalPriceSubject.asObservable();
  
  private totalQuantitySubject = new BehaviorSubject<number>(0);
  public totalQuantity$ = this.totalQuantitySubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private productService: ProductService
  ) {
    // Load cart from localStorage only in browser
    if (isPlatformBrowser(this.platformId)) {
      this.loadCartFromStorage();
    }
  }

  addToCart(product: Product, quantity: number = 1): Observable<any> {
    return new Observable(observer => {
      // Check if product has sufficient stock
      if (product.unitsInStock < quantity) {
        observer.error(new Error(`Insufficient stock. Only ${product.unitsInStock} items available.`));
        return;
      }

      const cartItems = this.cartItemsSubject.value;
      const existingItemIndex = cartItems.findIndex(item => item.product.id === product.id);
      
      // Check total quantity including existing cart items
      const existingQuantity = existingItemIndex > -1 ? cartItems[existingItemIndex].quantity : 0;
      const totalQuantityNeeded = existingQuantity + quantity;
      
      if (product.unitsInStock < totalQuantityNeeded) {
        const available = product.unitsInStock - existingQuantity;
        observer.error(new Error(`Insufficient stock. Only ${available} more items can be added.`));
        return;
      }

      // Update stock in database first
      this.productService.decreaseProductStock(product.id!, quantity).subscribe({
        next: (response) => {
          // Update local cart after successful stock update
          if (existingItemIndex > -1) {
            // Update existing item quantity
            cartItems[existingItemIndex].quantity += quantity;
          } else {
            // Add new item
            cartItems.push({ product, quantity });
          }

          this.updateCart(cartItems);
          observer.next({ success: true, message: 'Item added to cart successfully!' });
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  removeFromCart(productId: number): Observable<any> {
    return new Observable(observer => {
      const cartItems = this.cartItemsSubject.value;
      const itemToRemove = cartItems.find(item => item.product.id === productId);
      
      if (!itemToRemove) {
        observer.error(new Error('Item not found in cart'));
        return;
      }

      // Restore stock in database
      this.productService.increaseProductStock(productId, itemToRemove.quantity).subscribe({
        next: (response) => {
          // Remove item from cart after successful stock restore
          const updatedCartItems = cartItems.filter(item => item.product.id !== productId);
          this.updateCart(updatedCartItems);
          observer.next({ success: true, message: 'Item removed from cart successfully!' });
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  updateQuantity(productId: number, newQuantity: number): Observable<any> {
    return new Observable(observer => {
      const cartItems = this.cartItemsSubject.value;
      const itemIndex = cartItems.findIndex(item => item.product.id === productId);

      if (itemIndex === -1) {
        observer.error(new Error('Item not found in cart'));
        return;
      }

      const currentItem = cartItems[itemIndex];
      const currentQuantity = currentItem.quantity;
      const quantityDifference = newQuantity - currentQuantity;

      if (newQuantity <= 0) {
        // Remove item completely
        this.removeFromCart(productId).subscribe({
          next: (result) => observer.next(result),
          error: (error) => observer.error(error)
        });
        return;
      }

      if (quantityDifference > 0) {
        // Increasing quantity - need to decrease stock
        this.productService.decreaseProductStock(productId, quantityDifference).subscribe({
          next: (response) => {
            cartItems[itemIndex].quantity = newQuantity;
            this.updateCart(cartItems);
            observer.next({ success: true, message: 'Quantity updated successfully!' });
            observer.complete();
          },
          error: (error) => observer.error(error)
        });
      } else if (quantityDifference < 0) {
        // Decreasing quantity - need to increase stock
        this.productService.increaseProductStock(productId, Math.abs(quantityDifference)).subscribe({
          next: (response) => {
            cartItems[itemIndex].quantity = newQuantity;
            this.updateCart(cartItems);
            observer.next({ success: true, message: 'Quantity updated successfully!' });
            observer.complete();
          },
          error: (error) => observer.error(error)
        });
      } else {
        // No change in quantity
        observer.next({ success: true, message: 'No changes made' });
        observer.complete();
      }
    });
  }

  clearCart(): Observable<any> {
    return new Observable(observer => {
      const cartItems = this.cartItemsSubject.value;
      
      if (cartItems.length === 0) {
        observer.next({ success: true, message: 'Cart is already empty' });
        observer.complete();
        return;
      }

      // Restore stock for all items
      const stockRestorePromises = cartItems.map(item => 
        this.productService.increaseProductStock(item.product.id!, item.quantity).toPromise()
      );

      Promise.all(stockRestorePromises).then(() => {
        this.updateCart([]);
        observer.next({ success: true, message: 'Cart cleared successfully!' });
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  getCartItemCount(): number {
    return this.totalQuantitySubject.value;
  }

  getCartTotal(): number {
    return this.totalPriceSubject.value;
  }

  private updateCart(cartItems: CartItem[]): void {
    this.cartItemsSubject.next(cartItems);
    this.computeCartTotals();
    this.saveCartToStorage(cartItems);
  }

  private computeCartTotals(): void {
    const cartItems = this.cartItemsSubject.value;
    
    let totalPrice = 0;
    let totalQuantity = 0;

    cartItems.forEach(item => {
      totalPrice += item.quantity * item.product.unitPrice;
      totalQuantity += item.quantity;
    });

    this.totalPriceSubject.next(totalPrice);
    this.totalQuantitySubject.next(totalQuantity);
  }

  private saveCartToStorage(cartItems: CartItem[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }

  private loadCartFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedItems = localStorage.getItem('cartItems');
      if (storedItems) {
        const cartItems = JSON.parse(storedItems);
        this.cartItemsSubject.next(cartItems);
        this.computeCartTotals();
      }
    }
  }
}
