import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notification-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.css']
})
// This component displays notifications and confirmation dialogs.
export class NotificationModalComponent {
  notification$: Observable<Notification | null>;

  constructor(private notificationService: NotificationService) {
    this.notification$ = this.notificationService.notifications$;
  }

  onConfirm(notification: Notification): void {
    if (notification.onConfirm) {
      notification.onConfirm();
    }
    this.notificationService.hide();
  }

  onCancel(): void {
    this.notificationService.hide();
  }
}
