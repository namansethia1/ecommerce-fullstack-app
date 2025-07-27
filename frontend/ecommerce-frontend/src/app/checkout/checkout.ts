import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CartItem } from '../models/cart.model';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout implements OnInit {
  checkoutForm!: FormGroup;
  cartItems: CartItem[] = [];
  isProcessing = false;
  subtotal = 0;
  shipping = 9.99;
  tax = 0;
  total = 0;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadCartItems();
    this.loadUserInfo();
  }

  private initializeForm(): void {
    this.checkoutForm = this.fb.group({
      // Personal Information
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      
      // Shipping Address
      address: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      
      // Payment Information
      paymentMethod: ['credit', Validators.required],
      cardName: [''],
      cardNumber: [''],
      expiryDate: [''],
      cvv: [''],
      
      // Other
      sameAsShipping: [true],
      orderNotes: ['']
    });

    // Add conditional validators for payment fields
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(value => {
      const cardFields = ['cardName', 'cardNumber', 'expiryDate', 'cvv'];
      
      if (value === 'credit' || value === 'debit') {
        cardFields.forEach(field => {
          this.checkoutForm.get(field)?.setValidators([Validators.required]);
        });
      } else {
        cardFields.forEach(field => {
          this.checkoutForm.get(field)?.clearValidators();
        });
      }
      
      cardFields.forEach(field => {
        this.checkoutForm.get(field)?.updateValueAndValidity();
      });
    });
  }

  private loadCartItems(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotals();
  }

  private loadUserInfo(): void {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.authService.getUserProfile().subscribe({
        next: (userProfile: any) => {
          this.checkoutForm.patchValue({
            firstName: userProfile.firstName || '',
            lastName: userProfile.lastName || '',
            email: userProfile.email || ''
          });
        },
        error: (error: any) => {
          console.error('Error loading user profile:', error);
        }
      });
    }
  }

  private calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => 
      sum + (item.product.unitPrice * item.quantity), 0);
    
    this.tax = this.subtotal * 0.08; // 8% tax rate
    this.total = this.subtotal + this.shipping + this.tax;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.checkoutForm.valid && this.cartItems.length > 0) {
      this.isProcessing = true;
      
      const orderData = {
        ...this.checkoutForm.value,
        items: this.cartItems,
        subtotal: this.subtotal,
        shipping: this.shipping,
        tax: this.tax,
        total: this.total,
        orderDate: new Date().toISOString()
      };

      // Simulate order processing
      setTimeout(() => {
        console.log('Order submitted:', orderData);
        alert('Order placed successfully! You will receive a confirmation email shortly.');
        
        // Clear cart after successful order
        this.cartService.clearCart().subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Error clearing cart:', error);
            this.router.navigate(['/']);
          }
        });
        
        this.isProcessing = false;
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.checkoutForm.controls).forEach(key => {
        this.checkoutForm.get(key)?.markAsTouched();
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }
}
