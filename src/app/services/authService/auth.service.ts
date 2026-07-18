import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);
  private http = inject(HttpClient);

  endpoint = 'api/login/glosys';
  baseUrl = environment.loginURL;
  apiURL = environment.apiUrl;

  login(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.endpoint}`, {
      email: payload.email,
      password: payload.password,
    });
  }

  getUserInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/info`);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`http://localhost:22000/auth/forgot-password`, { email });
    // return this.http.post(`${this.baseUrl}/auth/forgot-password`, { email });
    // return this.apiService.post('auth/forgot-password', { email });
  }

  resetPassword(email: string, token: string, newPassword: string): Observable<any> {
    return this.http.post(`http://localhost:22000/auth/reset-password`, {
      email,
      token,
      newPassword,
    });

    // return this.apiService.post('auth/reset-password', { email, token, newPassword });
  }

  logout(): void {
    localStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem('angular_token');
  }

  getMenus(locationId: string) {
    return this.http.get(`${this.baseUrl}/api/menus/${locationId}`);
  }

  checkPasswordStatus(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/UserManagements/users/${userId}/password-status`);
  }
}
