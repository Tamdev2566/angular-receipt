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
  gridData: any[] = [];

  columns: ColumnDef[] = [
    { label: 'Customer Name', field: 'transactionNo', width: '160px' },
    { label: 'Reference No', field: 'transactionDate', width: '170px' },
    { label: 'Currency', field: 'currency', align: 'center', width: '90px' },
    { label: 'Amount', field: 'amount', width: '120px' },
  ];
  onExport() {}
  onCancel() {}
  retrieveInvoice() {}
}
