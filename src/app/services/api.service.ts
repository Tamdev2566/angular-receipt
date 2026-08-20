import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

export interface ApiRequestOptions {
  headers?: HttpHeaders | Record<string, string | string[]>;
  context?: HttpContext;
  params?:
    HttpParams | Record<string, string | number | boolean | readonly (string | number | boolean)[]>;
  reportProgress?: boolean;
  withCredentials?: boolean;
  responseType?: 'json' | 'blob' | 'text' | 'arraybuffer';
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  private http = inject(HttpClient);

  get<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, options as object);
  }

  selfGet<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.get<T>(endpoint, options as object);
  }

  post<T = unknown, B = unknown>(
    endpoint: string,
    data: B,
    options?: ApiRequestOptions,
  ): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, options as object);
  }

  put<T = unknown, B = unknown>(
    endpoint: string,
    data: B,
    options?: ApiRequestOptions,
  ): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data, options as object);
  }

  patch<T = unknown, B = unknown>(
    endpoint: string,
    data: B,
    options?: ApiRequestOptions,
  ): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, data, options as object);
  }

  delete<T = unknown>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, options as object);
  }
}
