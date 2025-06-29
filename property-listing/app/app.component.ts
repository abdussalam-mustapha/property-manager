import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';
import { NotificationModalComponent } from './components/notification-modal/notification-modal.component';
import { AuthService } from './services/auth.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, NotificationModalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
// Main application component
export class AppComponent {
  currentUser$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser;
  }
}
