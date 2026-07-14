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

  login(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.endpoint}`, {
      email: payload.email,
      password: payload.password,
    });

    // return this.apiService.post('login/glosys', {
    //   email: payload.email,
    //   password: payload.password,
    // });
  }

  getUserInfo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/info`);
    // return this.apiService.get('info');
  }

  logout(): void {
    localStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem('angular_token');
  }

  getMenus(locationId: string) {
    return this.http.get(`${this.baseUrl}/api/menus/${locationId}`);
    // return this.apiService.get(`/menus/${locationId}`);
  }

  checkPasswordStatus(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/UserManagements/users/${userId}/password-status`);
    // return this.apiService.get(`UserManagements/users/${userId}/password-status`);
  }
}
