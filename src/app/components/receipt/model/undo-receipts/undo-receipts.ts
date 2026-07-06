import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColumnDef, DataGrid } from '../../../../shared/data-grid/data-grid';

@Component({
  selector: 'app-undo-receipt',
  standalone: true,
  imports: [CommonModule, FormsModule, DataGrid],
  templateUrl: './undo-receipts.html',
})
export class UndoReceiptComponent {
  gridColumns: ColumnDef[] = [
    { label: 'Receipt No', field: 'no', align: 'start' },
    { label: 'Date', field: 'date', align: 'start' },
    { label: 'Payment Mode', field: 'mode', align: 'start' },
    { label: 'Cheque / Ref', field: 'cheque', align: 'start' },
    { label: 'Amount', field: 'amount', align: 'end' },
  ];

  gridData = [
    {
      no: 'REC-101',
      date: '2026-06-01',
      mode: 'Cheque / TT',
      cheque: 'CHQ.8821',
      amount: '$4,250.00',
    },
  ];

  invoiceColumns: ColumnDef[] = [
    { label: 'Invoice No', field: 'no', align: 'start' },
    { label: 'Date', field: 'date', align: 'center' },
    { label: 'Currency', field: 'currency', align: 'center' },
    { label: 'Amount', field: 'amount', align: 'end' },
    { label: 'Received', field: 'received', align: 'end' },
    { label: 'Adjustment', field: 'adjust', align: 'end' },
  ];

  invoices = [
    {
      no: 'DI23003580',
      date: '2026-06-01',
      currency: 'SGD',
      amount: '$4,250.00',
      received: '$4,250.00',
      adjust: '$0.00',
    },
  ];
  searchForm = {
    invoiceNumber: 'DI23003580',
    blNumber: 'BL-00210',
    chequeNumber: 'CHQ.8821',
  };

  detailsForm = {
    blNumber: 'BL-00210',
    vesselName: 'KOTA RAJA',
    voyageNumber: 'V.202X',
    customerName: 'PIL SHIPPING AGENCY',
  };

  retrieveMatches() {
    console.log('Retrieving matches for:', this.searchForm);
  }
  undoPayment() {
    console.log('Retrieving matches for:');
  }
}
