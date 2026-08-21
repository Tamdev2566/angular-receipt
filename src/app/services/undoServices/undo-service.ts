import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class UndoService {
  private invoiceSource = new BehaviorSubject<Record<string, any> | null>(null);
  private invoiceRemoveSource = new BehaviorSubject<Record<string, any> | null>(null);
  private receiptActionCompletedSource = new Subject<void>();

  currentInvoice = this.invoiceSource.asObservable();
  currentRemoveInvoice = this.invoiceRemoveSource.asObservable();
  receiptActionCompleted = this.receiptActionCompletedSource.asObservable();
  apiService = inject(ApiService);

  setInvoice(data: Record<string, any>): void {
    this.invoiceSource.next(data);
  }

  getInvoice(): Record<string, any> | null {
    return this.invoiceSource.getValue();
  }

  clearInvoice(): void {
    this.invoiceSource.next(null);
  }

  setRemoveInvoice(data: Record<string, any>): Promise<Record<string, any>> {
    const transactionNo = data['transactionNo'];
    const url = `api/removeInvoices/transaction/${transactionNo}`;

    return new Promise((resolve, reject) => {
      this.apiService.get(url).subscribe({
        next: (response: any) => {
          const updatedData = { ...data, ...response };
          this.invoiceRemoveSource.next(updatedData);
          resolve(updatedData);
        },
        error: (err: any) => {
          console.error('API Error:', err);
          reject(err);
        },
      });
    });
  }

  getRemoveInvoice(): Record<string, any> | null {
    return this.invoiceRemoveSource.getValue();
  }

  clearRemoveInvoice(): void {
    this.invoiceRemoveSource.next(null);
  }

  notifyReceiptActionCompleted(): void {
    this.receiptActionCompletedSource.next();
  }
}
