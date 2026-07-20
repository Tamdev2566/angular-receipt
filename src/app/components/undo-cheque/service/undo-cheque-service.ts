import { Injectable, inject } from '@angular/core';

import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class ChequeService {
  private apiService = inject(ApiService);

  searchCheque(chequeNo: string, fullChequeNo: string): Observable<any> {
    const params = new HttpParams().set('chequeNo', chequeNo).set('fullChequeNo', fullChequeNo);
    return this.apiService.get('api/undoCheque/search', { params });
  }

  undoCheque(payload: {
    chequeNo: string;
    fullChequeNo: string;
    remark: string;
    userId: string;
  }): Observable<any> {
    return this.apiService.post('api/undoCheque/undo', payload);
  }
}
