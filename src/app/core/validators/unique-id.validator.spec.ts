import { signal } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { of, Observable } from 'rxjs';
import { uniqueIdValidator } from './unique-id.validator';

describe('uniqueIdValidator', () => {
  let productServiceSpy: any;

  beforeEach(() => {
    productServiceSpy = {
      verifyId: vi.fn()
    };
  });

  it('should return null if isEditMode is true', () => {
    const validator = uniqueIdValidator(productServiceSpy, signal(true));
    const control = new FormControl('123');

    const result = validator(control) as Observable<ValidationErrors | null>;
    result.subscribe(res => {
      expect(res).toBeNull();
      expect(productServiceSpy.verifyId).not.toHaveBeenCalled();
    });
  });

  it('should return null if control value is empty', () => {
    const validator = uniqueIdValidator(productServiceSpy, signal(false));
    const control = new FormControl('');

    const result = validator(control) as Observable<ValidationErrors | null>;
    result.subscribe(res => {
      expect(res).toBeNull();
      expect(productServiceSpy.verifyId).not.toHaveBeenCalled();
    });
  });

  it('should return { idExists: true } if id exists', () => {
    productServiceSpy.verifyId.mockReturnValue(of(true));
    const validator = uniqueIdValidator(productServiceSpy, signal(false));
    const control = new FormControl('123');

    const result = validator(control) as Observable<ValidationErrors | null>;
    result.subscribe(res => {
      expect(res).toEqual({ idExists: true });
      expect(productServiceSpy.verifyId).toHaveBeenCalledWith('123');
    });
  });

  it('should return null if id does not exist', () => {
    productServiceSpy.verifyId.mockReturnValue(of(false));
    const validator = uniqueIdValidator(productServiceSpy, signal(false));
    const control = new FormControl('123');

    const result = validator(control) as Observable<ValidationErrors | null>;
    result.subscribe(res => {
      expect(res).toBeNull();
    });
  });
});