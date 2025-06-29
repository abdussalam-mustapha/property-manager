import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() closeDialog = new EventEmitter<boolean>();

  constructor(private authService: AuthService) { }

  login(role: 'Admin' | 'User'): void {
    const username = role === 'Admin' ? 'Admin User' : 'Regular User';
    this.authService.login(username, role);
    this.closeDialog.emit(true);
    // In a real app, you'd show a toast notification here.
    console.log(`Logged in as ${role}`);
  }

  close(): void {
    this.closeDialog.emit(false);
  }
}
