import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  login(payload: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/login/glosys`, {
      email: payload.email,
      password: payload.password,
    });
  }

  getUserInfo(): Observable<any> {
    const token = localStorage.getItem('angular_token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(`${environment.apiUrl}/info`, { headers });
  }

  logout(): void {
    localStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem('angular_token');
  }
}
