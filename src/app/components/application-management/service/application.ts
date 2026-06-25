import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private baseUrl = 'http://localhost:22000/ApplicationManagements';

  constructor(private http: HttpClient) {}

  getApplications(search: string, valid: string, page: number, size: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/applications/${search}/${valid}/${page}/${size}/ASC/app_name`,
    );
  }

  create(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/applications`, payload);
  }

  update(appId: string, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/applications/${appId}`, payload);
  }

  delete(appId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/applications/${appId}`);
  }

  updateStatus(appId: string, payload: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/applications/${appId}/status`, payload);
  }
}
