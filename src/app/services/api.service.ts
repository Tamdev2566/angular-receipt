import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  private loginUrl = environment.loginUrl;

  private http = inject(HttpClient);

  get(endpoint: string, options?: any) {
    return this.http.get(`${this.baseUrl}/${endpoint}`, options);
  }

  post(endpoint: string, data: any, options?: any) {
    return this.http.post(`${this.baseUrl}/${endpoint}`, data, options);
  }

  put(endpoint: string, data: any, options?: any) {
    return this.http.put(`${this.baseUrl}/${endpoint}`, data, options);
  }

  delete(endpoint: string, options?: any) {
    return this.http.delete(`${this.baseUrl}/${endpoint}`, options);
  }
  loginPost(endpoint: string, data: any, options?: any) {
    return this.http.post(`${this.loginUrl}/${endpoint}`, data, options);
  }
  infoGet(endpoint: string, options?: any) {
    return this.http.get(`${this.loginUrl}/${endpoint}`, options);
  }
}
