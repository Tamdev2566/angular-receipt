import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class UpdateChequeService {
  private api = inject(ApiService);
  searchCheque(chequeNo: string) {
    return this.api.get<any>('api/cheque/search', { params: { chequeNo } });
  }

  updateCheque(payload: any) {
    return this.api.post('api/cheque/update', payload);
  }
}
