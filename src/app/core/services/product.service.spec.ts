import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { provideHttpClient } from '@angular/common/http';
import { FinancialProduct, ApiResponse } from '../models/financial-product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3002/bp/products';

  const mockProduct: FinancialProduct = {
    id: '123',
    name: 'Test Product',
    description: 'Description',
    logo: 'logo.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get products', () => {
    const mockResponse: ApiResponse<FinancialProduct[]> = {
      data: [mockProduct]
    };

    service.getProducts().subscribe(products => {
      expect(products.length).toBe(1);
      expect(products).toEqual([mockProduct]);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create a product', () => {
    const mockResponse: ApiResponse<FinancialProduct> = {
      data: mockProduct
    };

    service.createProduct(mockProduct).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockResponse);
  });

  it('should update a product', () => {
    const mockResponse: ApiResponse<FinancialProduct> = {
      data: mockProduct
    };

    service.updateProduct(mockProduct).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${apiUrl}/${mockProduct.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockResponse);
  });

  it('should delete a product', () => {
    service.deleteProduct('123').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/123`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should verify id', () => {
    service.verifyId('123').subscribe(exists => {
      expect(exists).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/verification/123`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('should get product by id', () => {
    service.getProductById('123').subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${apiUrl}/123`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });
});
