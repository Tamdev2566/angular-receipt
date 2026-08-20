import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  private http = inject(HttpClient);

  get<T>(endpoint: string, options?: any): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, options) as Observable<T>;
  }

  selfGet<T>(endpoint: string, options?: any): Observable<T> {
    return this.http.get<T>(endpoint, options) as Observable<T>;
  }

  post(endpoint: string, data: any, options?: any) {
    return this.http.post(`${this.baseUrl}/${endpoint}`, data, options);
  }

  put(endpoint: string, data: any, options?: any) {
    return this.http.put(`${this.baseUrl}/${endpoint}`, data, options);
  }

  patch(endpoint: string, data: any, options?: any) {
    return this.http.patch(`${this.baseUrl}/${endpoint}`, data, options);
  }

  delete(endpoint: string, options?: any) {
    return this.http.delete(`${this.baseUrl}/${endpoint}`, options);
  }
}
