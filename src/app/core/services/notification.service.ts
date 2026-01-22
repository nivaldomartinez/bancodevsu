import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type NotificationType = 'error' | 'success';

export interface NotificationConfig {
  message: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSubject = new Subject<NotificationConfig>();
  notifications$ = this.notificationSubject.asObservable();

  showToast(message: string, type: NotificationType) {
    this.notificationSubject.next({ message, type });
  }

  showError(message: string) {
    this.showToast(message, 'error');
  }

  showSuccess(message: string) {
    this.showToast(message, 'success');
  }
}
