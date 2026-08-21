import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alertService/alert';
import { ApiService } from '../../../services/api.service';
import { MenuAccessService } from '../../../services/menu-access';
import { UndoService } from '../../../services/undoServices/undo-service';
import { UserService } from '../../../services/userService/user.service';
import { ColumnDef, DataGrid } from '../../../shared/data-grid/data-grid';
import { UndoPaymentService } from '../undopayment-service';

@Component({
  selector: 'app-undo-receipt',
  standalone: true,
  imports: [CommonModule, FormsModule, DataGrid],
  templateUrl: './undo-payment-details.html',
  styleUrl: './undo-payment-details.scss',
})
export class UndoPaymentDetails implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  paginatedRecords: any[] = [];
  selectedRecord: any = null;
  selectedRecords: any[] = [];

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
  recordData = input<any>();

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
    { label: 'Reference Date', field: 'transactionDate', width: '140px' },
    { label: 'Reference No', field: 'referenceNo', width: '170px' },
    { label: 'Currency', field: 'currency', align: 'center', width: '90px' },
    { label: 'Settlement Amount', field: 'settlementAmt', width: '150px' },
    { label: 'SGD Amount', field: 'sgdAmount', width: '120px' },
    { label: 'USD Amount', field: 'usdAmount', width: '120px' },
    { label: 'Original SGD', field: 'originalsgdAmount', width: '120px' },
    { label: 'Original USD', field: 'originalusdAmount', width: '120px' },
    { label: 'Partial', field: 'partial', align: 'center', type: 'checkbox', width: '90px' },
    { label: 'Write-off', field: 'writeOff', align: 'center', type: 'checkbox', width: '90px' },
  ];

  outstandingColumns: ColumnDef[] = [
    { label: 'Reference No', field: 'referenceNo', width: '180px' },
    { label: 'Currency', field: 'currency', align: 'center', width: '90px' },
    { label: 'Amount', field: 'amount', width: '130px' },
  ];

  private menuAccessService = inject(MenuAccessService);

  get isUndoAllowed(): boolean {
    return this.menuAccessService.currentPermission().fullAccess;
  }

  constructor(
    private userService: UserService,
    private apiService: ApiService,
    private alert: AlertService,
    private router: Router,
    private undoService: UndoPaymentService,
    private undogGlobalService: UndoService,
  ) {}

  ngOnInit(): void {
    const invoiceData = this.undogGlobalService.getInvoice();

    if (invoiceData?.['transactionNo']) {
      this.retrieve.invoiceNo = invoiceData?.['transactionNo'];
      this.retrieveReceipt(invoiceData['transactionNo']);
    }

    this.menuAccessService.checkPermissionForUrl(this.router.url);
  }

  // onRowSelect(record: any): void {
  //   if (record) {
  //     this.selectedRecord = record;
  //   } else {
  //     this.selectedRecord = null;
  //   }
  // }

  onRowSelect(record: any): void {
    this.selectedRecords = this.receiptGrid.filter((row) => row.isSelected);
  }

  retrieveReceipt(invoiceNo?: string): void {
    this.undoService
      .retrieveRecords(
        this.retrieve.invoiceNo || invoiceNo || '',
        this.retrieve.blNo,
        this.retrieve.chequeNo,
      )
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res: any) => {
          if (res) {
            this.details = {
              blNo: res.blNo || '',
              vesselName: res.vesselName || '',
              voyageNo: res.voyageNo || '',
              customerName: res.customerName || '',
            };

            this.receiptGrid = res.receipts || [];

            if (res.invoices) {
              this.invoiceGrid = res.invoices.map((inv: any) => ({
                type: inv.type,
                transactionDate: inv.transactionDate || '',
                referenceNo: inv.referenceNo,
                currency: inv.currency,
                settlementAmount: inv.settlementAmt,
                sgdAmount: inv.sgdAmount,
                usdAmount: inv.usdAmount,
                originalSGD: inv.originalsgdAmount,
                originalUSD: inv.originalusdAmount,
                partial: inv.partial || 'N',
                writeOff: inv.writeOff || 'N',
              }));
            } else {
              this.invoiceGrid = [];
              this.alert.showAlert('Error', res.message, 'error');
            }

            this.outstandingGrid = res.outstandings || [];
          }
        },
        error: (err) => {
          this.alert.showAlert('Error', 'Failed to retrieve records.', 'error');
        },
      });
  }

  undoReceipt(): void {
    if (this.selectedRecords.length === 0) {
      this.alert.showAlert(
        'Warning',
        'Please select at least one record from the Receipt grid to undo.',
        'warning',
      );
      return;
    }

    const payload: string[] = this.selectedRecords.map((record) => record.transactionNo || '');

    this.undoService.processUndo(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.alert.showAlert(
          'Success',
          res.message || 'Undo Payment Processed Successfully',
          'success',
        );
        this.selectedRecords = [];
        this.onCancel();
        this.undogGlobalService.notifyReceiptActionCompleted();
      },
      error: (error) => {
        this.alert.showAlert(
          'Error',
          error?.error?.message || 'Unable to Undo the Selected Receipts.',
          'error',
        );
      },
    });
  }

  onCancel(): void {
    // history.back();
    this.retrieve = {
      invoiceNo: '',
      blNo: '',
      chequeNo: '',
    };

    this.details = {
      blNo: '',
      vesselName: '',
      voyageNo: '',
      customerName: '',
    };

    this.receiptGrid = [];

    this.invoiceGrid = [];

    this.outstandingGrid = [];
  }
}
