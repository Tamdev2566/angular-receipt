import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { DashboardData, KpiStat, ReceiptActivity } from '../../../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  apiService = inject(ApiService);
  private http = inject(HttpClient);

  private readonly baseUrl = 'http://localhost:8080/api/dashboard';

  getReceiptSummary(): Observable<any> {
    // return this.apiService.get('api/dashboard/receiptSummary');
    return this.http.get<any>(`${this.baseUrl}/receiptSummary`);
  }

  getKPIs(): Observable<Record<string, KpiStat[]>> {
    // return this.apiService.get('api/dashboard/kpi');
    return this.http.get<Record<string, KpiStat[]>>(`${this.baseUrl}/kpi`);
  }

  getRecentReceipts(): Observable<ReceiptActivity[]> {
    // return this.apiService.get('api/dashboard/recent-receipts');
    return this.http.get<ReceiptActivity[]>(`${this.baseUrl}/recent-receipts`);
  }
}
