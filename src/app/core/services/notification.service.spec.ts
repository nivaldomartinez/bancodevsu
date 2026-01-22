import { TestBed } from '@angular/core/testing';
import { NotificationService, NotificationConfig } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit success notification', () => {
    service.notifications$.subscribe(notification => {
      expect(notification).toEqual({ message: 'Success!', type: 'success' });
    });

    service.showSuccess('Success!');
  });

  it('should emit error notification', () => {
    let result: NotificationConfig | undefined;
    service.notifications$.subscribe(notification => {
      result = notification;
    });

    service.showError('Error!');
    expect(result).toEqual({ message: 'Error!', type: 'error' });
  });

  it('should emit generic toast notification', () => {
    let result: NotificationConfig | undefined;
    service.notifications$.subscribe(notification => {
      result = notification;
    });

    service.showToast('Info', 'error');
    expect(result).toEqual({ message: 'Info', type: 'error' });
  });
});
