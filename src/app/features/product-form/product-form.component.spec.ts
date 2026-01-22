import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../core/services/product.service';
import { NotificationService } from '../../core/services/notification.service';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { FinancialProduct } from '../../core/models/financial-product.model';
import { DatePipe } from '@angular/common';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productServiceSpy: any;
  let notificationServiceSpy: any;
  let routerSpy: any;

  const mockProduct: FinancialProduct = {
    id: '123',
    name: 'Test Product',
    description: 'Test Description Long Enough',
    logo: 'logo.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01'
  };

  beforeEach(async () => {
    productServiceSpy = {
      getProductById: vi.fn().mockReturnValue(of(mockProduct)),
      createProduct: vi.fn().mockReturnValue(of(mockProduct)),
      updateProduct: vi.fn().mockReturnValue(of(mockProduct)),
      verifyId: vi.fn().mockReturnValue(of(false))
    };

    notificationServiceSpy = {
      showSuccess: vi.fn(),
      showError: vi.fn()
    };
  });

  const setup = async (idInput?: string) => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: productServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        DatePipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    
    if (idInput) {
      fixture.componentRef.setInput('id', idInput);
    }
    
    routerSpy = TestBed.inject(Router);
    vi.spyOn(routerSpy, 'navigate');

    fixture.detectChanges();
  };

  it('should create in create mode', async () => {
    await setup();
    expect(component).toBeTruthy();
    expect(component.isEditMode()).toBe(false);
    expect(component.productForm.get('id')?.disabled).toBe(false);
  });

  it('should create in edit mode and load product', async () => {
    await setup('123');
    expect(component).toBeTruthy();
    expect(component.isEditMode()).toBe(true);
    expect(productServiceSpy.getProductById).toHaveBeenCalledWith('123');
    expect(component.productForm.get('id')?.disabled).toBe(true);
    expect(component.productForm.get('name')?.value).toBe(mockProduct.name);
  });

  it('should calculate revision date automatically', async () => {
    await setup();
    const releaseControl = component.productForm.get('date_release');
    const revisionControl = component.productForm.get('date_revision');

    releaseControl?.setValue('2024-01-01');
    expect(revisionControl?.value).toBe('2025-01-01');

    releaseControl?.setValue('2024-05-20');
    expect(revisionControl?.value).toBe('2025-05-20');
  });

  it('should submit new product', async () => {
    await setup();
    
    component.productForm.patchValue({
      id: 'new-id',
      name: 'New Product',
      description: 'New Description Long',
      logo: 'logo.png',
      date_release: '2030-01-01' 
    });
    
    fixture.detectChanges(); 
    
    expect(component.productForm.valid).toBe(true);

    component.submit();

    expect(productServiceSpy.createProduct).toHaveBeenCalled();
    expect(notificationServiceSpy.showSuccess).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should update existing product', async () => {
    await setup('123');
    
    component.productForm.patchValue({
      name: 'Updated Name'
    });

    component.submit();

    expect(productServiceSpy.updateProduct).toHaveBeenCalled();
    expect(notificationServiceSpy.showSuccess).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should not submit if form is invalid', async () => {
    await setup();
    component.submit();
    expect(productServiceSpy.createProduct).not.toHaveBeenCalled();
    expect(component.productForm.touched).toBe(true);
  });
  
  it('should reset form', async () => {
    await setup();
    component.productForm.get('name')?.setValue('Changed');
    component.reset();
    expect(component.productForm.get('name')?.value).toBe(null);
  });

  it('should reset to initial values in edit mode', async () => {
    await setup('123');
    component.productForm.get('name')?.setValue('Changed');
    component.reset();
    expect(productServiceSpy.getProductById).toHaveBeenCalledTimes(2);
  });
});
