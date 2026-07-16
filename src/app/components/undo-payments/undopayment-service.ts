import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class UndoPaymentService {
  private apiService = inject(ApiService);

  retrieveRecords(invoiceNo: string, blNo: string, chequeNo: string): Observable<any> {
    const params = {
      ...(invoiceNo && { invoiceNo: invoiceNo }),
      ...(blNo && { blNo: blNo }),
      ...(chequeNo && { chequeNo: chequeNo }),
    };
    return this.apiService.get('api/undo-payment/retrieve', { params });
  }

  processUndo(transactionNumbers: string[]): Observable<any> {
    return this.apiService.put('api/undo-payment/execute-rollback', transactionNumbers);
  }
}
