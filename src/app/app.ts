import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationService, NotificationConfig } from './core/services/notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private notificationService = inject(NotificationService);
  notification = signal<NotificationConfig | null>(null);

  ngOnInit() {
    this.notificationService.notifications$.subscribe(notification => {
      this.notification.set(notification);
      setTimeout(() => this.notification.set(null), 5000);
    });
  }
}