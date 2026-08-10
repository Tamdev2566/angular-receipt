import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { finalize } from 'rxjs';
import * as XLSX from 'xlsx-js-style';
import { ApiService } from '../../../services/api.service';
import { MenuAccessService } from '../../../services/menu-access';
import { ModuleService } from '../../../services/module-service/module-service';
import { UndoService } from '../../../services/undoServices/undo-service';
import { SummaryCard } from '../../../shared/summary-card/summary-card';
import { Wrapper } from '../../../shared/wrapper/wrapper';
import { RemoveInvoiceDetails } from '../../remove-invoice/remove-invoice-details/remove-invoice-details';
import { UndoPaymentDetails } from '../../undo-payments/undo-payment-details/undo-payment-details';

interface Receipt {
  transactionNo?: string;
  transactionDate?: string;
  officeCode?: string;
  customerName?: string;
  paymentMode?: string;
  receiptDate?: string;
  referenceNo?: string;
  chequeTtNo?: string;
  currencyCode?: string;
  amount?: number;
  bankCharge?: number;
  paidInvoiceTotal?: number;
  receiptTotal?: number;
  balanceAmount?: number;
  postedToCoda?: boolean;
  status?: boolean;
  bank?: string;
  createdDate?: string;
  createdUser?: string;
  modifiedDate?: string;
  modifiedUser?: string;
}

interface ReceiptResponse {
  data?: Receipt[];
  content?: Receipt[];
  items?: Receipt[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, Wrapper, SummaryCard],
  templateUrl: './receipts.html',
  styleUrls: ['./receipts.scss'],
})
export class ReceiptComponent implements OnInit {
  undoReceipt = UndoPaymentDetails;
  removeReceipt = RemoveInvoiceDetails;

  showUndoModal = false;
  showRemoveModal = false;

  selectedRecord: any = null;
  toastMessage: string | null = null;
  searchQuery = '';
  filteredReceipts: Receipt[] = [];
  receipts: Receipt[] = [];
  loading = false;

  private menuAccessService = inject(MenuAccessService);

  constructor(
    private router: Router,
    private stateService: ModuleService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private undoService: UndoService,
  ) {}

  get isCreateAllowed(): boolean {
    return this.menuAccessService.currentPermission().fullAccess;
  }

  ngOnInit() {
    this.menuAccessService.checkPermissionForUrl(this.router.url);
    this.loadReceipts();
  }

  loadReceipts(): void {
    this.loading = true;

    this.apiService
      .get<Receipt[] | ReceiptResponse>('api/receipts/retrive')
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: Receipt[] | ReceiptResponse) => {
          this.receipts = Array.isArray(res) ? res : (res.data ?? res.content ?? res.items ?? []);
          this.filteredReceipts = [...this.receipts];
        },
        error: () => {
          this.receipts = [];
          this.filteredReceipts = [];
        },
      });
  }

  onCreateClick() {
    if (!this.isCreateAllowed) return;
    this.router.navigate(['/main/new-receipt']);
  }

  onUpdateClick() {
    if (!this.isCreateAllowed) return;
    this.router.navigate(['/main/new-receipt']);
  }

  onPrintClick(): void {
    if (!this.filteredReceipts.length) {
      this.triggerToast('There are no receipts to download.');
      return;
    }

    const exportRows = this.filteredReceipts.map((receipt) => ({
      'Transaction No': receipt.transactionNo,
      'Transaction Date': receipt.transactionDate,
      'Office Code': receipt.officeCode,
      Customer: receipt.customerName || '',
      'Payment Mode': receipt.paymentMode,
      'Receipt Date': receipt.receiptDate,
      'Reference No': receipt.referenceNo,
      'Cheque / TT No': receipt.chequeTtNo || '',
      Currency: receipt.currencyCode,
      Amount: receipt.amount,
      'Bank Charge': receipt.bankCharge,
      'Paid Invoice Total': receipt.paidInvoiceTotal,
      'Receipt Total': receipt.receiptTotal,
      'Balance Amount': receipt.balanceAmount,
      'Posted to CODA': receipt.postedToCoda ? 'Yes' : 'No',
      Status: receipt.status ? 'Active' : 'Inactive',
      Bank: receipt.bank,
      'Created Date': receipt.createdDate,
      'Created User': receipt.createdUser,
      'Modified Date': receipt.modifiedDate,
      'Modified User': receipt.modifiedUser,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    worksheet['!cols'] = Object.keys(exportRows[0]).map((key) => ({
      wch: Math.max(key.length + 2, 14),
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Receipts');
    XLSX.writeFile(workbook, `receipts-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  onClickHistory() {}

  onSearch(): void {
    const query = this.searchQuery.toLowerCase().trim();

    if (!query) {
      this.filteredReceipts = [...this.receipts];
      return;
    }

    this.filteredReceipts = this.receipts.filter(
      (item) =>
        this.matches(item.transactionNo, query) ||
        this.matches(item.referenceNo, query) ||
        this.matches(item.customerName, query) ||
        this.matches(item.chequeTtNo, query) ||
        this.matches(item.paymentMode, query) ||
        this.matches(item.bank, query) ||
        this.matches(item.officeCode, query),
    );
  }

  private matches(value: string | undefined, query: string): boolean {
    return (value || '').toLowerCase().includes(query);
  }

  openUndoModal(item: any) {
    this.selectedRecord = item;
    this.showUndoModal = true;
    this.stateService.setModalState(true);
    this.undoService.setInvoice(item);
  }

  openRemoveModal(item: any) {
    this.selectedRecord = item;
    this.showRemoveModal = true;
    this.stateService.setModalState(true);
    this.undoService.setRemoveInvoice(item);
  }

  closeModal() {
    this.showUndoModal = false;
    this.showRemoveModal = false;
    this.selectedRecord = null;
    this.stateService.setModalState(false);
  }

  triggerToast(msg: string) {
    this.toastMessage = msg;

    setTimeout(() => {
      this.toastMessage = null;
    }, 4000);
  }
}
