import { Signal } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, catchError, map, of } from 'rxjs';
import { ProductService } from '../services/product.service';

export const uniqueIdValidator = (
  productService: ProductService,
  isEditMode: Signal<boolean>
): AsyncValidatorFn => {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
  
    if (isEditMode()) {
      return of(null);
    }

    if (!control.value) {
      return of(null);
    }

    return productService.verifyId(control.value).pipe(
      map((exists) => (exists ? { idExists: true } : null)),
      catchError(() => of(null))
    );
  };
};
