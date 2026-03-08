import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem, Product } from '../models/store.models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storageKey = 'ecommerce_cart_items';
  private readonly cartItemsSubject = new BehaviorSubject<CartItem[]>(this.readCartFromStorage());

  cartItems$ = this.cartItemsSubject.asObservable();

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  getCartCount(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.quantity, 0);
  }

  addToCart(product: Product): void {
    const next = [...this.cartItemsSubject.value];
    const existing = next.find((item) => item.product.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      next.push({ product, quantity: 1 });
    }

    this.updateState(next);
  }

  decreaseQuantity(productId: number): void {
    const next = [...this.cartItemsSubject.value];
    const existing = next.find((item) => item.product.id === productId);

    if (!existing) {
      return;
    }

    existing.quantity -= 1;

    this.updateState(next.filter((item) => item.quantity > 0));
  }

  increaseQuantity(productId: number): void {
    const next = [...this.cartItemsSubject.value];
    const existing = next.find((item) => item.product.id === productId);

    if (!existing) {
      return;
    }

    existing.quantity += 1;
    this.updateState(next);
  }

  removeItem(productId: number): void {
    const next = this.cartItemsSubject.value.filter((item) => item.product.id !== productId);
    this.updateState(next);
  }

  clearCart(): void {
    this.updateState([]);
  }

  private updateState(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private readCartFromStorage(): CartItem[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as CartItem[];
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter((item) => item && item.product && item.quantity > 0);
    } catch {
      return [];
    }
  }
}
