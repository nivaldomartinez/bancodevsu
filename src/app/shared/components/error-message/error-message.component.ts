import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (shouldShowError()) {
      <span class="error-msg">{{ getErrorMessage() }}</span>
    }
  `,
  styles: [`
    .error-msg {
      color: #d32f2f;
      font-size: 12px;
      font-weight: 500;
      margin-top: 4px;
      display: block;
    }
  `]
})
export class ErrorMessageComponent {
  @Input({ required: true }) control!: AbstractControl | null;
  @Input() label: string = 'Este campo';

  shouldShowError(): boolean {
    return !!(this.control && this.control.invalid && (this.control.dirty || this.control.touched));
  }

  getErrorMessage(): string {
    if (!this.control || !this.control.errors) return '';

    const errors = this.control.errors;

    if (errors['required']) {
      return 'Este campo es requerido!';
    }
    if (errors['minlength']) {
      return `Mínimo ${errors['minlength'].requiredLength} caracteres!`;
    }
    if (errors['maxlength']) {
      return `Máximo ${errors['maxlength'].requiredLength} caracteres!`;
    }
    if (errors['idExists']) {
      return 'ID no válido! (Ya existe)';
    }
    if (errors['pastDate']) {
      return 'La fecha debe ser igual o mayor a hoy!';
    }
    
    return 'Campo inválido';
  }
}
