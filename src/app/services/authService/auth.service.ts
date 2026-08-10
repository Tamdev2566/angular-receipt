import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environment/environment';
import { AlertService } from '../alertService/alert';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private alert = inject(AlertService);

  endpoint = 'api/login/glosys';
  baseUrl = environment.loginURL;

  private tokenTimer: any;

  constructor() {
    this.autoAuthUser();
  }

  login(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.endpoint}`, {
      email: payload.email,
      password: payload.password,
    });
  }

  setAuthTimer(durationInSeconds: number): void {
    if (this.tokenTimer) {
      clearTimeout(this.tokenTimer);
    }

    this.tokenTimer = setTimeout(() => {
      this.handleSessionExpiry();
    }, durationInSeconds * 1000);
  }

  autoAuthUser(): void {
    const token = this.getToken();
    const expiryStr =
      localStorage.getItem('receipt_token_expire') || localStorage.getItem('token_expire');

    if (!token || !expiryStr) {
      return;
    }

    const formattedExpiryStr = expiryStr.trim().replace(' ', 'T');
    const expiryTime = new Date(formattedExpiryStr).getTime();
    const currentTime = new Date().getTime();
    const expiresInSeconds = (expiryTime - currentTime) / 1000;

    if (expiresInSeconds > 0) {
      this.setAuthTimer(expiresInSeconds);
    } else {
      this.handleSessionExpiry();
    }
  }

  private handleSessionExpiry(): void {
    if (this.tokenTimer) {
      clearTimeout(this.tokenTimer);
    }
    this.alert.showAlert('Error', 'Your Session is Expired!', 'error');
    localStorage.removeItem('receipt_token');
    localStorage.removeItem('receipt_token_expire');
    localStorage.removeItem('user');
    localStorage.removeItem('passwordExpired');
    localStorage.removeItem('defaultLocation');
    localStorage.removeItem('locationList');
    this.logout(false);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const expiryStr =
      localStorage.getItem('receipt_token_expire') || localStorage.getItem('token_expire');

    if (!token || !expiryStr) {
      return false;
    }

    const formattedExpiryStr = expiryStr.trim().replace(' ', 'T');
    const expiryTime = new Date(formattedExpiryStr).getTime();
    const currentTime = new Date().getTime();

    if (isNaN(expiryTime)) {
      return false;
    }

    if (currentTime < expiryTime) {
      return true;
    } else {
      this.handleSessionExpiry();
      return false;
    }
  }

  getUserInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/info`);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/forgot-password`, { email });
  }

  resetPassword(email: string, token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/reset-password`, { email, token, newPassword });
  }

  logout(showAlert: boolean = true): void {
    if (this.tokenTimer) clearTimeout(this.tokenTimer);
    if (showAlert) this.alert.showAlert('Info', 'Logged out successfully', 'info');

    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('receipt_token') || localStorage.getItem('angular_token');
  }

  getMenus(locationId: string) {
    return this.http.get(`${this.baseUrl}/api/menus/${locationId}`);
  }

  checkPasswordStatus(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/UserManagements/users/${userId}/password-status`);
  }

  getAppMenus(locationId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/MenuManagements/menus/${locationId}`);
  }
}
