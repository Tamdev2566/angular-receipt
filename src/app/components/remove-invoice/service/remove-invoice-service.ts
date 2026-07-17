import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class RemoveInvoiceService {
  private api = inject(ApiService);

  searchInvoices(customer: string, vessel: string, voyage: string): Observable<any[]> {
    const options = {
      params: { customer, vessel, voyage },
    };
    return this.api.get<any[]>('api/removeInvoices/search', options);
  }

  removeInvoices(referenceNos: string[], userId: string, remark: string): Observable<any> {
    const payload = { referenceNos, userId, remark };
    return this.api.post('api/removeInvoices/remove', payload);
  }
}
