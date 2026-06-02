import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}Token`;

  jwtAccessToken(credentials: any): Observable<any> {
    const body = new HttpParams()
      .set('username', credentials.user_code)
      .set('password', credentials.user_pass)
      .set('grant_type', 'password');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post<any>(this.apiUrl, body.toString(), { headers }).pipe(
      tap((response) => {
        if (response && response?.access_token) {
          localStorage.setItem('angular_token', response?.access_token);
        }
      }),
    );
  }
}
