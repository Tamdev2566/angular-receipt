import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userData = new BehaviorSubject<any[]>([]);
  currentUser$ = this.userData.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);

        this.userData.next(Array.isArray(user) ? user : [user]);
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
      }
    }
  }

  setUser(value: any[]) {
    this.userData.next(value);

    localStorage.setItem('user', JSON.stringify(value));
  }

  getUser() {
    return this.userData.getValue();
  }
}
