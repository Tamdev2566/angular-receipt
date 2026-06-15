import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userData = new BehaviorSubject<any | null>(null);

  currentUser$ = this.userData.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('user');

    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.userData.next(user);
      } catch (error) {
        console.error('Error parsing user data', error);
      }
    }
  }

  setUser(user: any): void {
    this.userData.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): any {
    return this.userData.getValue();
  }

  clearUser(): void {
    this.userData.next(null);
    localStorage.removeItem('user');
  }
}
