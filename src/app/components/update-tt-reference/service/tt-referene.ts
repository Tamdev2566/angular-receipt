import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class TtReferene {
  private api = inject(ApiService);

  searchTT(ttNo: string) {
    return this.api.get<any>('api/tt-ref/search', { params: { ttNo } });
  }

  updateTT(payload: any) {
    return this.api.post('api/tt-ref/update', payload);
  }
}
