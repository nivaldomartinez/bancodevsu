import { ChangeDetectionStrategy, Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgClass, DatePipe } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { NotificationService } from '../../core/services/notification.service';
import { uniqueIdValidator } from '../../core/validators/unique-id.validator';
import { futureDateValidator } from '../../core/validators/future-date.validator';
import { FinancialProduct } from '../../core/models/financial-product.model';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgClass, ErrorMessageComponent],
  providers: [DatePipe]
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private datePipe = inject(DatePipe);

  // Route Param Input
  id = input<string>();

  isSubmitting = signal(false);
  isEditMode = signal(false);
  originalReleaseDate = signal<string | null>(null);

  productForm = this.fb.group({
    id: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
      [uniqueIdValidator(this.productService, this.isEditMode)],
    ],
    name: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(100)],
    ],
    description: [
      '',
      [Validators.required, Validators.minLength(10), Validators.maxLength(200)],
    ],
    logo: ['', [Validators.required]],
    date_release: [
      '', 
      [
        Validators.required, 
        futureDateValidator(this.isEditMode, this.originalReleaseDate)
      ]
    ],
    date_revision: [{ value: '', disabled: true }, [Validators.required]],
  });

  constructor() {
    this.productForm.get('date_release')?.valueChanges.subscribe((releaseDate) => {
      if (releaseDate && this.isValidDate(releaseDate)) {
        const parts = releaseDate.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        
        const nextYearDate = new Date(year + 1, month - 1, day);
        
        const revisionDate = this.datePipe.transform(nextYearDate, 'yyyy-MM-dd');
        
        this.productForm.get('date_revision')?.setValue(revisionDate);
      } else {
        this.productForm.get('date_revision')?.setValue('');
      }
    });
  }

  ngOnInit() {
    if (this.id()) {
      this.isEditMode.set(true);
      this.loadProduct(this.id()!);
    }
  }

  loadProduct(id: string) {
    this.productForm.get('id')?.disable();
    
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        const releaseDate = this.datePipe.transform(product.date_release, 'yyyy-MM-dd');
        const revisionDate = this.datePipe.transform(product.date_revision, 'yyyy-MM-dd');

        this.originalReleaseDate.set(releaseDate);

        const formattedProduct = {
          ...product,
          date_release: releaseDate,
          date_revision: revisionDate,
        };
        
        this.productForm.patchValue(formattedProduct);
      },
      error: (err) => {
        console.error(err);
        this.notificationService.showError('Error al cargar el producto');
        this.router.navigate(['/products']);
      },
    });
  }

  submit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.productForm.getRawValue() as FinancialProduct;

    const request$ = this.isEditMode()
      ? this.productService.updateProduct(formValue)
      : this.productService.createProduct(formValue);

    request$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        const msg = this.isEditMode() ? 'Producto actualizado!' : 'Producto agregado!';
        this.notificationService.showSuccess(msg);
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.notificationService.showError('Error al guardar el producto');
        console.error(err);
      },
    });
  }

  reset() {
    if (this.isEditMode() && this.id()) {
       this.loadProduct(this.id()!);
       return;
    }
    this.productForm.reset();
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
  
  isInvalid(field: string): boolean {
      const control = this.productForm.get(field);
      return !!(control?.invalid && (control.touched || control.dirty));
  }
}
