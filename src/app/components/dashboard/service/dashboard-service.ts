import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { KpiStat, ReceiptActivity } from '../../../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  apiService = inject(ApiService);

  getReceiptSummary(): Observable<any> {
    return this.apiService.get('api/dashboard/receiptSummary');
  }

  getKPIs(): Observable<Record<string, KpiStat[]>> {
    return this.apiService.get('api/dashboard/kpi');
  }

  getRecentReceipts(): Observable<ReceiptActivity[]> {
    return this.apiService.get('api/dashboard/recent-receipts');
  }
}
