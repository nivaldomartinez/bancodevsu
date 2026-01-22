import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './error.interceptor';
import { NotificationService } from '../services/notification.service';

describe('ErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let notificationService: NotificationService;

  beforeEach(() => {
    const notificationSpy = {
      showError: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: NotificationService, useValue: notificationSpy }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    notificationService = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should catch error and call notification service', () => {
    httpClient.get('/test').subscribe({
      next: () => { throw new Error('should have failed with an error'); },
      error: (error) => {
        expect(error).toBeTruthy();
        expect(notificationService.showError).toHaveBeenCalled();
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush('Something went wrong', {
      status: 500,
      statusText: 'Server Error'
    });
  });

  it('should catch ErrorEvent and call notification service', () => {
    const errorEvent = new ErrorEvent('Network error', {
      message: 'Network error occurred'
    });

    httpClient.get('/test').subscribe({
      next: () => { throw new Error('should have failed with an error'); },
      error: (error) => {
         expect(error).toBeTruthy();
         expect(notificationService.showError).toHaveBeenCalledWith('Error: Network error occurred');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush(errorEvent, { status: 0, statusText: 'Error' });
  });
});
