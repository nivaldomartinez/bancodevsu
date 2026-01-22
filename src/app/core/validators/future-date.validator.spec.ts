import { signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { futureDateValidator } from './future-date.validator';

describe('futureDateValidator', () => {
  it('should return null if control value is empty', () => {
    const validator = futureDateValidator(signal(false), signal(null));
    const control = new FormControl('');
    expect(validator(control)).toBeNull();
  });

  it('should return null if in edit mode and value matches original date', () => {
    const validator = futureDateValidator(signal(true), signal('2024-01-01'));
    const control = new FormControl('2024-01-01');
    expect(validator(control)).toBeNull();
  });

  it('should return null for future dates', () => {
    const validator = futureDateValidator(signal(false), signal(null));
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const dateString = futureDate.toISOString().split('T')[0];
    
    const control = new FormControl(dateString);
    expect(validator(control)).toBeNull();
  });

  it('should return error for past dates', () => {
    const validator = futureDateValidator(signal(false), signal(null));
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 1);
    const dateString = pastDate.toISOString().split('T')[0];
    
    const control = new FormControl(dateString);
    expect(validator(control)).toEqual({ pastDate: true });
  });

  it('should return null for today', () => {
     const validator = futureDateValidator(signal(false), signal(null));
     const today = new Date();
     const dateString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
     
     const control = new FormControl(dateString);
  
     expect(validator(control)).toBeNull();
  });
});
