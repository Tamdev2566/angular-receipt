import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);

  login(payload: any): Observable<any> {
    return this.apiService.loginPost('login/glosys', {
      email: payload.email,
      password: payload.password,
    });
  }

  getUserInfo(): Observable<any> {
    return this.apiService.infoGet('info');
  }

  logout(): void {
    localStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem('angular_token');
  }
}
