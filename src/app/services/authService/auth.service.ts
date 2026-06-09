import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  login(payload: any): Observable<any> {
    const body = {
      email: payload.email,
      password: payload.password,
    };

    return this.http.post(`${environment.apiUrl}/login/glosys`, body);
  }

  logout(): void {
    localStorage.clear();
  }

  getToken(): string | null {
    return localStorage.getItem('sessionId');
  }
}
