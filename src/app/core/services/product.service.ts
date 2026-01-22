import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse, FinancialProduct } from '../models/financial-product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3002/bp/products';

  getProducts(): Observable<FinancialProduct[]> {
    return this.http
      .get<ApiResponse<FinancialProduct[]>>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  createProduct(product: FinancialProduct): Observable<FinancialProduct> {
    return this.http
      .post<ApiResponse<FinancialProduct>>(this.apiUrl, product)
      .pipe(map((response) => response.data));
  }

  updateProduct(product: FinancialProduct): Observable<FinancialProduct> {
    return this.http
      .put<ApiResponse<FinancialProduct>>(`${this.apiUrl}/${product.id}`, product)
      .pipe(map((response) => response.data));
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verification/${id}`);
  }

  getProductById(id: string): Observable<FinancialProduct> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
