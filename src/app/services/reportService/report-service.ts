import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiService = inject(ApiService);

  postEdiToCoda(url: string, fromDate: string, toDate: string): Observable<any> {
    const params = new HttpParams().set('fromDate', fromDate).set('toDate', toDate);
    return this.apiService.post(url, {}, { params });
  }

  getReport(url: string, fromDate: string, toDate: string): Observable<any> {
    const params = new HttpParams().set('fromDate', fromDate).set('toDate', toDate);
    return this.apiService.get(url, { params });
  }
  getAgingReport(url: string, days: string): Observable<any> {
    const params = new HttpParams().set('days', days);
    return this.apiService.get(url, { params });
  }

  downloadReport(url: string, fromDate: string, toDate: string): Observable<Blob> {
    const params = new HttpParams().set('fromDate', fromDate).set('toDate', toDate);
    return this.apiService.get(url, { params: params, responseType: 'blob' });
  }

  downloadAgingReport(url: string, days: string): Observable<Blob> {
    const params = new HttpParams().set('days', days);
    return this.apiService.get(url, { params: params, responseType: 'blob' });
  }

  exportToExcel(data: Blob, fileName: string, fromDate: string, toDate: string) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}_${fromDate}_to_${toDate}.csv`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  exportToExcelAging(data: Blob, fileName: string, days: string) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    // Current DateTime format (YYYYMMDD_HHMMSS)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;

    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}_${timestamp}.csv`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
