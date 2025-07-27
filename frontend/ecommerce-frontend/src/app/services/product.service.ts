import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Category } from '../models/product.model';

export interface ProductResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}



  getProducts(page: number = 0, size: number = 20, sortBy: string = 'name', sortDir: string = 'asc'): Observable<ProductResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<ProductResponse>(`${this.apiUrl}/products`, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  getProductsByCategory(categoryId: number, page: number = 0, size: number = 10): Observable<ProductResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ProductResponse>(`${this.apiUrl}/products/category/${categoryId}`, { params });
  }

  searchProducts(keyword: string, page: number = 0, size: number = 10): Observable<ProductResponse> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ProductResponse>(`${this.apiUrl}/products/search`, { params });
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, product);
  }

  updateProductStock(id: number, newStock: number): Observable<Product> {
    // Get the current product first, then update only the stock
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  decreaseProductStock(productId: number, quantity: number): Observable<any> {
    const params = new HttpParams().set('quantity', quantity.toString());
    return this.http.put(`${this.apiUrl}/products/${productId}/decrease-stock`, null, { params });
  }

  increaseProductStock(productId: number, quantity: number): Observable<any> {
    const params = new HttpParams().set('quantity', quantity.toString());
    return this.http.put(`${this.apiUrl}/products/${productId}/increase-stock`, null, { params });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }
}
