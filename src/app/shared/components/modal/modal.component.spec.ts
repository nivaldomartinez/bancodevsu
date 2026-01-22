import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { By } from '@angular/platform-browser';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the message', () => {
    fixture.componentRef.setInput('message', 'Test Message');
    fixture.detectChanges();
    const msgEl = fixture.debugElement.query(By.css('.modal-message')).nativeElement;
    expect(msgEl.textContent).toContain('Test Message');
  });

  it('should emit onConfirm when confirm button clicked', () => {
    const emitSpy = vi.spyOn(component.onConfirm, 'emit');
    const btn = fixture.debugElement.query(By.css('.btn-confirm'));
    btn.triggerEventHandler('click', null);
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit onCancel when cancel button clicked', () => {
    const emitSpy = vi.spyOn(component.onCancel, 'emit');
    const btn = fixture.debugElement.query(By.css('.btn-cancel'));
    btn.triggerEventHandler('click', null);
    expect(emitSpy).toHaveBeenCalled();
  });
});
