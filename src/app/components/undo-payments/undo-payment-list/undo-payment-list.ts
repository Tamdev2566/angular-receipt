import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from '../../../services/loaderService/loader-service';
import { ColumnDef, DataGrid } from '../../../shared/data-grid/data-grid';

@Component({
  selector: 'app-undo-payment-list',
  imports: [CommonModule, FormsModule, DataGrid],
  templateUrl: './undo-payment-list.html',
  styleUrl: './undo-payment-list.scss',
})
export class UndoPaymentList {
  searchQuery = '';
  selectedRecord: any = null;

  receipts: any[] = [];
  filteredReceipts: any[] = [];
  receiptGrid: any[] = [];
  paginatedRecords: any[] = [];

  receiptColumns: ColumnDef[] = [
    { label: 'Transaction No', field: 'transactionNo', width: '160px' },
    { label: 'Transaction Date', field: 'transactionDate', width: '170px' },
    { label: 'Receipt Date', field: 'receiptDate', width: '140px' },
    { label: 'Reference No', field: 'referenceNo', width: '150px' },
    { label: 'Currency', field: 'currency', align: 'center', width: '90px' },
    { label: 'Amount', field: 'amount', width: '120px' },
  ];

  constructor(private router: Router) {}

  onCreateClick() {
    this.router.navigate(['/main/undo-payment-details']);
  }

  onPrintClick() {}

  onClickHistory() {}

  onSearch(value?: any): void {
    const query = this.searchQuery.toLowerCase().trim() || value.toLowerCase().trim();

    if (!query) {
      this.filteredReceipts = [...this.receipts];
      return;
    }

    this.filteredReceipts = this.receipts.filter(
      (item) =>
        item.invoiceNo.toLowerCase().includes(query) ||
        item.customerName.toLowerCase().includes(query) ||
        item.vesselName.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query),
    );
  }

  onRowSelect(record: any): void {
    this.trackSelectionLogs();
    // this.rowData.setRowData(record);
  }

  trackSelectionLogs(): void {
    const selectedRows = this.paginatedRecords.filter((row) => row.isSelected);

    this.selectedRecord = selectedRows.length === 1 ? selectedRows[0] : null;
  }
}
