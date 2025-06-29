import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'confirm';
  onConfirm?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification | null>();

  get notifications$(): Observable<Notification | null> {
    return this.notificationSubject.asObservable();
  }

  show(notification: Notification): void {
    this.notificationSubject.next(notification);
  }

  showSuccess(message: string): void {
    this.show({ message, type: 'success' });
  }

  showError(message: string): void {
    this.show({ message, type: 'error' });
  }

  showConfirmation(message: string, onConfirm: () => void): void {
    this.show({ message, type: 'confirm', onConfirm });
  }

  hide(): void {
    this.notificationSubject.next(null);
  }
}
