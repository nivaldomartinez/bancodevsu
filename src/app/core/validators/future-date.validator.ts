import { Signal } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const futureDateValidator = (
  isEditMode: Signal<boolean>,
  originalReleaseDate: Signal<string | null>
): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    if (isEditMode() && originalReleaseDate() === value) {
      return null;
    }

    const parts = value.split('-');

    const inputDate = new Date(
      parseInt(parts[0], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[2], 10)
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate < today) {
      return { pastDate: true };
    }
    return null;
  };
};
