import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColumnDef, DataGrid } from '../../../shared/data-grid/data-grid';

@Component({
  selector: 'app-undo-receipt',
  standalone: true,
  imports: [CommonModule, FormsModule, DataGrid],
  templateUrl: './undo-receipt.html',
  styleUrls: ['./undo-receipt.scss'],
})
export class UndoReceipt {
  paginatedRecords: any[] = [];
  selectedRecord: any = null;

  retrieve = {
    invoiceNo: '',
    blNo: '',
    chequeNo: '',
  };

  details = {
    blNo: '',
    vesselName: '',
    voyageNo: '',
    customerName: '',
  };

  receiptGrid: any[] = [];

  invoiceGrid: any[] = [];

  outstandingGrid: any[] = [];

  receiptColumns: ColumnDef[] = [
    { label: 'Transaction No', field: 'transactionNo', width: '160px' },
    { label: 'Transaction Date', field: 'transactionDate', width: '170px' },
    { label: 'Receipt Date', field: 'receiptDate', width: '140px' },
    { label: 'Reference No', field: 'referenceNo', width: '150px' },
    { label: 'Currency', field: 'currency', align: 'center', width: '90px' },
    { label: 'Amount', field: 'amount', width: '120px' },
  ];

  invoiceColumns: ColumnDef[] = [
    { label: 'Type', field: 'type', width: '90px' },
    { label: 'Reference Date', field: 'referenceDate', width: '140px' },
    { label: 'Reference No', field: 'referenceNo', width: '170px' },
    { label: 'Currency', field: 'currency', align: 'center', width: '90px' },
    { label: 'Settlement Amount', field: 'settlementAmount', width: '150px' },
    { label: 'SGD Amount', field: 'sgdAmount', width: '120px' },
    { label: 'USD Amount', field: 'usdAmount', width: '120px' },
    { label: 'Original SGD', field: 'originalSGD', width: '120px' },
    { label: 'Original USD', field: 'originalUSD', width: '120px' },
    { label: 'Partial', field: 'partial', align: 'center', width: '90px' },
  ];

  outstandingColumns: ColumnDef[] = [
    { label: 'Reference No', field: 'referenceNo', width: '180px' },
    { label: 'Currency', field: 'currency', align: 'center', width: '90px' },
    { label: 'Amount', field: 'amount', width: '130px' },
  ];

  constructor() {}

  ngOnInit(): void {}

  onRowSelect(record: any): void {
    this.trackSelectionLogs();
    console.log('record', record);
    // this.rowData.setRowData(record);
  }

  trackSelectionLogs(): void {
    const selectedRows = this.paginatedRecords.filter((row) => row.isSelected);

    this.selectedRecord = selectedRows.length === 1 ? selectedRows[0] : null;
  }
  retrieveReceipt(): void {
    // API Call
  }

  undoReceipt(): void {
    // Undo Payment API
  }

  onCancel(): void {
    history.back();
  }
}
