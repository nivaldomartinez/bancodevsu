import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { NotificationService } from './core/services/notification.service';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let notificationServiceMock: any;
  let notificationsSubject: Subject<any>;

  beforeEach(async () => {
    notificationsSubject = new Subject();
    notificationServiceMock = {
      notifications$: notificationsSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: NotificationService, useValue: notificationServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render brand name "BANCO"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-name')?.textContent).toContain('BANCO');
  });

  it('should show notification when service emits', () => {
    notificationsSubject.next({ message: 'Test Notification', type: 'success' });
    fixture.detectChanges();

    const toast = fixture.debugElement.query(By.css('.toast'));
    expect(toast).toBeTruthy();
    expect(toast.nativeElement.textContent).toContain('Test Notification');
    expect(toast.nativeElement.classList).toContain('toast-success');
  });
});