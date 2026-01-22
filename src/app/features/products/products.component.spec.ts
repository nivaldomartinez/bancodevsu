import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductsComponent } from './products.component';
import { ProductService } from '../../core/services/product.service';
import { NotificationService } from '../../core/services/notification.service';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FinancialProduct } from '../../core/models/financial-product.model';
import { By } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productServiceSpy: any;
  let notificationServiceSpy: any;

  const mockProducts: FinancialProduct[] = [
    {
      id: '1',
      name: 'Product A',
      description: 'Description A',
      logo: 'logo-a.png',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    },
    {
      id: '2',
      name: 'Product B',
      description: 'Description B',
      logo: 'logo-b.png',
      date_release: '2024-02-01',
      date_revision: '2025-02-01'
    },
    // Add more to test pagination if needed
    { id: '3', name: 'C', description: 'D', logo: 'l', date_release: '2025-01-01', date_revision: '2026-01-01' },
    { id: '4', name: 'D', description: 'D', logo: 'l', date_release: '2025-01-01', date_revision: '2026-01-01' },
    { id: '5', name: 'E', description: 'D', logo: 'l', date_release: '2025-01-01', date_revision: '2026-01-01' },
    { id: '6', name: 'F', description: 'D', logo: 'l', date_release: '2025-01-01', date_revision: '2026-01-01' },
  ];

  beforeEach(async () => {
    productServiceSpy = {
      getProducts: vi.fn().mockReturnValue(of(mockProducts)),
      deleteProduct: vi.fn().mockReturnValue(of({}))
    };

    notificationServiceSpy = {
      showSuccess: vi.fn(),
      showError: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        provideRouter([]),
        DatePipe, // Provided in component but good to be safe
        { provide: ProductService, useValue: productServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit -> loadProducts
  });

  it('should create and load products', () => {
    expect(component).toBeTruthy();
    expect(productServiceSpy.getProducts).toHaveBeenCalled();
    expect(component.products().length).toBe(6);
    expect(component.isLoading()).toBe(false);
  });

  it('should filter products by search term', () => {
    component.searchControl.setValue('Product A');
    fixture.detectChanges();
    
    expect(component.filteredProducts().length).toBe(1);
    expect(component.filteredProducts()[0].name).toBe('Product A');
  });

  it('should paginate products', () => {
    // Default page size 5
    expect(component.pageSize()).toBe(5);
    expect(component.paginatedProducts().length).toBe(5); // first 5
    expect(component.totalPages()).toBe(2); // 6 items / 5 = 2 pages
  });

  it('should navigate pages', () => {
    component.nextPage();
    fixture.detectChanges();
    expect(component.currentPage()).toBe(2);
    expect(component.paginatedProducts().length).toBe(1); // 6th item

    component.prevPage();
    fixture.detectChanges();
    expect(component.currentPage()).toBe(1);
  });

  it('should change page size', () => {
    const event = { target: { value: '10' } } as any;
    component.onPageSizeChange(event);
    fixture.detectChanges();

    expect(component.pageSize()).toBe(10);
    expect(component.totalPages()).toBe(1);
    expect(component.paginatedProducts().length).toBe(6);
  });

  it('should open delete modal', () => {
    const product = mockProducts[0];
    component.confirmDelete(product);
    expect(component.productToDelete()).toEqual(product);
    expect(component.showDeleteModal()).toBe(true);
  });

  it('should delete product successfully', () => {
    const product = mockProducts[0];
    component.confirmDelete(product);
    component.deleteProduct();

    expect(productServiceSpy.deleteProduct).toHaveBeenCalledWith(product.id);
    expect(notificationServiceSpy.showSuccess).toHaveBeenCalled();
    expect(component.showDeleteModal()).toBe(false);
    expect(productServiceSpy.getProducts).toHaveBeenCalledTimes(2); // Init + After delete
  });

  it('should handle delete error', () => {
    productServiceSpy.deleteProduct.mockReturnValue(throwError(() => new Error('Error')));
    const product = mockProducts[0];
    component.confirmDelete(product);
    component.deleteProduct();

    expect(notificationServiceSpy.showError).toHaveBeenCalled();
    expect(component.showDeleteModal()).toBe(false);
  });
});
