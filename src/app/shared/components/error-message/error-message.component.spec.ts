import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorMessageComponent } from './error-message.component';
import { FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;
  let fixture: ComponentFixture<ErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.control = new FormControl('');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not show error if control is valid', () => {
    component.control = new FormControl('valid');
    fixture.detectChanges();
    const errorEl = fixture.debugElement.query(By.css('.error-msg'));
    expect(errorEl).toBeNull();
  });

  it('should not show error if control is invalid but untouched/clean', () => {
    component.control = new FormControl('', Validators.required);
    fixture.detectChanges();
    const errorEl = fixture.debugElement.query(By.css('.error-msg'));
    expect(errorEl).toBeNull();
  });

  it('should show required error', () => {
    const control = new FormControl('', Validators.required);
    control.markAsTouched();
    component.control = control;
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('.error-msg')).nativeElement;
    expect(errorEl.textContent).toContain('Este campo es requerido!');
  });

  it('should show minlength error', () => {
    const control = new FormControl('ab', Validators.minLength(3));
    control.markAsTouched();
    component.control = control;
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('.error-msg')).nativeElement;
    expect(errorEl.textContent).toContain('Mínimo 3 caracteres!');
  });

  it('should show maxlength error', () => {
    const control = new FormControl('abcde', Validators.maxLength(3));
    control.markAsTouched();
    component.control = control;
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('.error-msg')).nativeElement;
    expect(errorEl.textContent).toContain('Máximo 3 caracteres!');
  });
  
  it('should show idExists error', () => {
    const control = new FormControl('123');
    control.setErrors({ idExists: true });
    control.markAsTouched();
    component.control = control;
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('.error-msg')).nativeElement;
    expect(errorEl.textContent).toContain('ID no válido! (Ya existe)');
  });

  it('should show pastDate error', () => {
    const control = new FormControl('2020-01-01');
    control.setErrors({ pastDate: true });
    control.markAsTouched();
    component.control = control;
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('.error-msg')).nativeElement;
    expect(errorEl.textContent).toContain('La fecha debe ser igual o mayor a hoy!');
  });
});
