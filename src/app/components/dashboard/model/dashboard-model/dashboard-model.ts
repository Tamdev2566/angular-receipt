import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnDef, DataGrid } from '../../../../shared/data-grid/data-grid';
import * as XLSX from 'xlsx-js-style';

@Component({
  selector: 'app-dashboard-model',
  standalone: true,
  imports: [CommonModule, DataGrid],
  templateUrl: './dashboard-model.html',
  styleUrl: './dashboard-model.scss',
})
export class DashboardModel {
  toastMessage: string | null = null;

  @Input() isOpen: boolean = false;
  @Input() gridData: any[] = [];
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;

  @Output() close = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<number>();

  gridColumns: ColumnDef[] = [
    { label: 'Transaction No', field: 'transactionNo', width: '130px' },
    { label: 'Reference No', field: 'referenceNo', width: '130px' },
    { label: 'Payment Mode', field: 'paymentMode', width: '100px' },
    { label: 'Currency', field: 'currencyCode', align: 'center', width: '90px' },
    { label: 'Amount', field: 'amount', width: '90px' },
    { label: 'Status', field: 'availableAction', width: '120px' },
    { label: 'Created Date', field: 'createdDate', width: '120px' },
    { label: 'Receipt Date', field: 'transactionDate', width: '120px' },
    { label: 'Created By', field: 'createdUser', width: '120px' },
  ];

  onClose() {
    this.close.emit();
  }

  onPageChange(event: any) {
    this.pageChange.emit(event);
  }

  onDownloadClick() {
    if (this.gridData.length === 0) {
      this.triggerToast('There are no receipts to download.');
      return;
    }

    const exportRows = this.gridData.map((receipt) => ({
      'Transaction No': receipt.transactionNo || '',
      'Reference No': receipt.referenceNo || '',
      'Office Code': receipt.officeCode || '',
      'Payment Mode': receipt.paymentMode || '',
      Currency: receipt.currencyCode || '',
      Amount: receipt.amount || 0,
      'Posted To CODA': receipt.postedToCoda ? 'Yes' : 'No',
      'Available Action': receipt.availableAction || '',
      'Action Message': receipt.actionMessage || '',
      Status: receipt.status ? 'Cancelled' : 'Active',
      'Transaction Date': receipt.transactionDate
        ? new Date(receipt.transactionDate).toLocaleString()
        : '',
      'Created Date': receipt.createdDate ? new Date(receipt.createdDate).toLocaleString() : '',
      'Created User': receipt.createdUser || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);

    const colWidths = Object.keys(exportRows[0]).map((key) => {
      const maxContentLen = Math.max(
        ...exportRows.map((row) => String(row[key as keyof typeof row] || '').length),
      );
      return { wch: Math.max(key.length, maxContentLen, 12) + 2 };
    });

    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Recent Receipts');

    const todayStr = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `Receipts_Export_${todayStr}.xlsx`);
  }

  triggerToast(msg: string) {
    this.toastMessage = msg;

    setTimeout(() => {
      this.toastMessage = null;
    }, 4000);
  }
}
