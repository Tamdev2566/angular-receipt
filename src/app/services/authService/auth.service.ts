import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { AlertService } from '../alertService/alert';
import { ApiMenuItem } from '../module-service/module-service';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expiresIn?: string;
  [key: string]: unknown;
}

const STORAGE_KEYS = {
  TOKEN: 'receipt_token',
  ALT_TOKEN: 'angular_token',
  EXPIRY: 'receipt_token_expire',
  USER: 'user',
  PASSWORD_EXPIRED: 'passwordExpired',
  DEFAULT_LOCATION: 'defaultLocation',
  LOCATION_LIST: 'locationList',
} as const;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly alert = inject(AlertService);

  private readonly endpoint = 'api/login/glosys';
  private readonly baseUrl = environment.loginURL;

  private tokenTimer?: ReturnType<typeof setTimeout>;
  private inactivityTimer?: ReturnType<typeof setTimeout>;

  private readonly INACTIVITY_TIMEOUT_MS = 20 * 60 * 1000;

  readonly currentUser = signal<unknown | null>(this.getStoredUser());
  readonly isAuthenticated = computed(() => this.isTokenValid());

  constructor() {
    this.autoAuthUser();
  }

  startInactivityTimer(): void {
    if (!this.isLoggedIn()) return;

    this.stopInactivityTimer();
    this.inactivityTimer = setTimeout(() => {
      this.handleInactivityExpiry();
      this.alert.showAlert(
        'Session Timeout',
        'You were inactive for too long. Please login again to continue.',
        'warning',
      );
    }, this.INACTIVITY_TIMEOUT_MS);
  }

  stopInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = undefined;
    }
  }

  resetInactivityTimer(): void {
    if (this.isLoggedIn()) {
      this.startInactivityTimer();
    }
  }

  private handleInactivityExpiry(): void {
    this.stopInactivityTimer();
    this.alert.showAlert('Warning', 'Session timed out due to inactivity', 'warning');
    this.logout(false);
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/${this.endpoint}`, {
      email: payload.email,
      password: payload.password,
    });
  }

  setAuthTimer(durationInSeconds: number): void {
    this.clearAuthTimer();

    const MAX_24_HOURS_MS = 24 * 60 * 60 * 1000;
    const timeoutMs = Math.min(durationInSeconds * 1000, MAX_24_HOURS_MS);

    this.tokenTimer = setTimeout(() => {
      this.handleSessionExpiry();
    }, timeoutMs);
  }

  autoAuthUser(): void {
    const token = this.getToken();
    const expiryStr = localStorage.getItem(STORAGE_KEYS.EXPIRY);

    if (!token || !expiryStr) {
      return;
    }

    const expiresInSeconds = this.getRemainingExpirySeconds(expiryStr);

    if (expiresInSeconds > 0) {
      this.setAuthTimer(expiresInSeconds);
      this.startInactivityTimer();
    } else {
      this.handleSessionExpiry();
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const expiryStr = localStorage.getItem(STORAGE_KEYS.EXPIRY);

    if (!token || !expiryStr) {
      return false;
    }

    const expiresInSeconds = this.getRemainingExpirySeconds(expiryStr);

    if (isNaN(expiresInSeconds)) {
      return false;
    }

    if (expiresInSeconds > 0) {
      return true;
    }

    this.handleSessionExpiry();
    return false;
  }

  getUserInfo(): Observable<unknown> {
    return this.http.get(`${this.baseUrl}/api/info`);
  }

  forgotPassword(email: string): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/api/auth/forgot-password`, { email });
  }

  resetPassword(email: string, token: string, newPassword: string): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/api/auth/reset-password`, { email, token, newPassword });
  }

  logout(showAlert = true): void {
    this.clearAuthTimer();
    this.stopInactivityTimer();

    if (showAlert) {
      this.alert.showAlert('Info', 'Logged out successfully', 'info');
    }

    localStorage.clear();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN) ?? localStorage.getItem(STORAGE_KEYS.ALT_TOKEN);
  }

  getMenus(locationId: string): Observable<unknown> {
    return this.http.get(`${this.baseUrl}/api/menus/${locationId}`);
  }

  checkPasswordStatus(userId: string): Observable<unknown> {
    return this.http.get(`${this.baseUrl}/api/UserManagements/users/${userId}/password-status`);
  }

  getAppMenus(locationId: string): Observable<ApiMenuItem[]> {
    return this.http.get<ApiMenuItem[]>(`${this.baseUrl}/api/MenuManagements/menus/${locationId}`);
  }

  private handleSessionExpiry(): void {
    this.clearAuthTimer();
    this.stopInactivityTimer();
    this.alert.showAlert('Error', 'Your Session is Expired!', 'error');

    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    this.logout(false);
  }

  private clearAuthTimer(): void {
    if (this.tokenTimer) {
      clearTimeout(this.tokenTimer);
      this.tokenTimer = undefined;
    }
  }

  private getRemainingExpirySeconds(expiryStr: string): number {
    const formattedExpiryStr = expiryStr.trim().replace(' ', 'T');
    const expiryTime = new Date(formattedExpiryStr).getTime();
    const currentTime = Date.now();

    return (expiryTime - currentTime) / 1000;
  }

  private isTokenValid(): boolean {
    const expiryStr = localStorage.getItem(STORAGE_KEYS.EXPIRY);
    return !!this.getToken() && !!expiryStr && this.getRemainingExpirySeconds(expiryStr) > 0;
  }

  private getStoredUser(): unknown | null {
    const rawUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (!rawUser) return null;

    try {
      return JSON.parse(rawUser);
    } catch {
      return null;
    }
  }
}
