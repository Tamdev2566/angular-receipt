import { Component } from '@angular/core';
import { ColumnDef, DataGrid } from '../../shared/data-grid/data-grid';
import { DatepickerComponent } from '../../shared/date-picker/date-picker';

@Component({
  selector: 'app-edi-to-coda',
  imports: [DataGrid, DatepickerComponent],
  templateUrl: './edi-to-coda.html',
  styleUrl: './edi-to-coda.scss',
})
export class EdiToCoda {
  fromDate: string | null = null;
  toDate: string | null = null;

  fromDateError = false;
  toDateError = false;

  gridData: any[] = [];

  columns: ColumnDef[] = [
    { label: 'Customer Name', field: 'transactionNo', width: '160px' },
    { label: 'Reference No', field: 'transactionDate', width: '170px' },
    { label: 'Currency', field: 'currency', align: 'center', width: '90px' },
    { label: 'Amount', field: 'amount', width: '120px' },
  ];

  onExport() {}

  onCancel() {
    this.fromDate = null;
    this.toDate = null;
    this.fromDateError = false;
    this.toDateError = false;
  }

  retrieveInvoice() {
    // Validation: Reset errors first
    this.fromDateError = !this.fromDate;
    this.toDateError = !this.toDate;

    // Standard date validation check
    if (this.fromDateError || this.toDateError) {
      return; // Stop execution if fields are empty
    }

    // Proceed with API call or logic if valid
    console.log('Fetching records for:', this.fromDate, 'to', this.toDate);
  }
}
