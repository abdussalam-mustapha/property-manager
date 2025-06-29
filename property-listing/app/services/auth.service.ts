import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private localStorageService: LocalStorageService) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.localStorageService.getItem<User>('currentUser'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, role: 'Admin' | 'User'): User {
    const user: User = { id: Date.now().toString(), username, role };
    this.localStorageService.setItem('currentUser', user);
    this.currentUserSubject.next(user);
    return user;
  }

  logout(): void {
    this.localStorageService.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
