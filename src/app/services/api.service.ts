import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  private appUrl = environment.appUrl;

  private http = inject(HttpClient);

  get(endpoint: string, options?: any, config: boolean = false) {
    if (config) {
      return this.http.get(`${this.appUrl}/${endpoint}`, options);
    }

    return this.http.get(`${this.baseUrl}/${endpoint}`, options);
  }

  post(endpoint: string, data: any, config: boolean = false, options?: any) {
    if (config) {
      return this.http.post(`${this.appUrl}/${endpoint}`, data, options);
    }

    return this.http.post(`${this.baseUrl}/${endpoint}`, data, options);
  }

  put(endpoint: string, data: any, config: boolean = false, options?: any) {
    if (config) {
      return this.http.put(`${this.appUrl}/${endpoint}`, data, options);
    }

    return this.http.put(`${this.baseUrl}/${endpoint}`, data, options);
  }

  patch(endpoint: string, data: any, config: boolean = false, options?: any) {
    if (config) {
      return this.http.patch(`${this.appUrl}/${endpoint}`, data, options);
    }

    return this.http.patch(`${this.baseUrl}/${endpoint}`, data, options);
  }

  delete(endpoint: string, config: boolean = false, options?: any) {
    if (config) {
      console.log('options', options);

      return this.http.delete(`${this.appUrl}/${endpoint}`, options);
    }

    return this.http.delete(`${this.baseUrl}/${endpoint}`, options);
  }
}
