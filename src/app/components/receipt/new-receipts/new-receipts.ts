import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Combobox, ComboboxSelection } from '../../../shared/combobox/combobox';
import { DatepickerComponent } from '../../../shared/date-picker/date-picker';
import { ColumnDef, DataGrid } from '../../../shared/data-grid/data-grid';
import { ApiService } from '../../../services/api.service';
import { UserService } from '../../../services/userService/user.service';
import { OutstandingModal } from '../modals/outstanding-modal/outstanding-modal';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog';
import { AlertService } from '../../../services/alertService/alert';

interface ReceiptInvoicePayload {
  selected: boolean;
  source: string;
  blNo: string;
  vesselCode: string;
  vesselName: string;
  voyageNo: string;
  customerName: string;
  type: string;
  referenceDate: string;
  referenceNo: string;
  currency: string;
  settlementAmount: number;
  valueDoc: number;
  valueDual: number;
  originalSgd: number;
  originalUsd: number;
  partial: boolean;
  writeoff: boolean;
}

interface ReceiptApiPayload {
  paymentMode: string;
  officeCode: string;
  referenceNo: string;
  currencyCode: string;
  amount: number;
  bankCharge: number;
  paidInvoiceTotal: number;
  receiptTotal: number;
  balanceAmount: number;
  bank: string;
  createdUser: string;
  modifiedUser: string;
  invoices: ReceiptInvoicePayload[];
}

interface AccountOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-new-receipt',
  imports: [
    CommonModule,
    FormsModule,
    Combobox,
    DatepickerComponent,
    DataGrid,
    OutstandingModal,
    ConfirmDialogComponent,
  ],
  templateUrl: './new-receipts.html',
  styleUrls: ['./new-receipts.scss'],
})
export class NewReceiptComponent implements OnInit {
  @Output() cancelReceipt = new EventEmitter<void>();

  docInward = true;
  docOutward = true;
  selectedPayment: any = null;

  gridData: any[] = [];
  selectedGridRows: any[] = [];
  totalPages: number = 1;
  currentPage: number = 1;

  vesselValue: any = {};

  formData = {
    paymentMode: '',
    chequeNo: '',
    receiptDate: '',
    currency: 'SGD',
    account: '',
    amount: '',
    bankCharges: '',
  };

  accounts: AccountOption[] = [];

  private readonly cashAccounts: AccountOption[] = [{ id: 'CASH', name: 'Cash' }];
  private readonly chequeAccounts: AccountOption[] = [{ id: 'CHEQUE', name: 'Cheque' }];
  private readonly ttAccounts: AccountOption[] = [
    { id: 'CITI', name: 'CITI Bank' },
    { id: 'UOB', name: 'UOB' },
    { id: 'OCBC', name: 'OCBC' },
  ];

  searchModel = {
    invoiceNo: '',
    blNo: '',
    vesselId: null,
    voyageId: null,
    customerName: '',
  };

  paymentTypes = [
    { id: 1, name: 'Cash' },
    { id: 2, name: 'Cheque' },
    { id: 3, name: 'T/T' },
  ];

  summary = {
    paidInvoiceTotal: '0.00',
    receiptTotal: '0.00',
    balance: '0.00',
  };

  showReferenceType = false;

  isOutstandingModalOpen = false;
  outstandingRecords: any[] = [];
  isMessageShow: boolean = false;

  gridColumns: ColumnDef[] = [
    { label: 'Reference No', field: 'reference_no', width: '130px' },
    { label: 'Reference Date', field: 'reference_date', width: '120px' },
    { label: 'BL No', field: 'bl_no', width: '130px' },
    { label: 'Currency', field: 'currency', align: 'center', width: '90px' },
    { label: 'Settlement Amount', field: 'settlement_amt', width: '140px' },
    { label: 'SGD Amount', field: 'sgd_amount', width: '120px' },
    { label: 'USD Amount', field: 'usd_amount', width: '120px' },
    { label: 'Original SGD', field: 'original_sgd', width: '120px' },
    { label: 'Original USD', field: 'original_usd', width: '120px' },
    { label: 'Partial', field: 'partial', width: '90px', align: 'center', type: 'checkbox' },
    { label: 'Write-off', field: 'write_off', width: '90px', align: 'center', type: 'checkbox' },
  ];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private alert: AlertService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.formData.receiptDate = this.today();
  }

  get isCustomerSelected(): boolean {
    return !!(this.searchModel.customerName && this.searchModel.customerName.trim().length > 0);
  }

  get isCheckOutstandingDisabled(): boolean {
    const hasCustomer = !!(
      this.searchModel.customerName && this.searchModel.customerName.trim().length > 0
    );

    const isSingleSystemSelected =
      (this.docInward && !this.docOutward) || (!this.docInward && this.docOutward);

    return !hasCustomer || !isSingleSystemSelected;
  }

  private checkIsOverPayment(): boolean {
    const totalEntered =
      this.toNumber(this.formData.amount) + this.toNumber(this.formData.bankCharges);
    const invoiceTotal = this.toNumber(this.summary.paidInvoiceTotal);

    return totalEntered > invoiceTotal && invoiceTotal > 0;
  }

  get isConfirmDisabled(): boolean {
    if (this.selectedGridRows.length === 0) return true;

    return this.checkIsOverPayment();
  }

  get isOverPaymentDisabled(): boolean {
    if (this.selectedGridRows.length === 0) return true;

    return !this.checkIsOverPayment();
  }

  onPaymentChange(value: any, item: any): void {
    this.selectedPayment = item;

    if (!item) {
      this.formData.chequeNo = '';
      this.formData.account = '';
      this.accounts = [];
      return;
    }

    if (item?.name === 'Cash') {
      this.accounts = [...this.cashAccounts];
      this.formData.chequeNo = 'CASH';
      this.formData.account = 'CASH';
      return;
    }

    this.formData.chequeNo = '';

    if (item?.name === 'Cheque') {
      this.accounts = [...this.chequeAccounts];
      this.formData.account = 'CHEQUE';
      return;
    }

    if (item?.name === 'T/T') {
      this.accounts = [...this.ttAccounts];
      this.formData.account = this.ttAccounts[0].id;
    }
  }

  onVesselChange(selection: ComboboxSelection): void {
    this.searchModel.vesselId = selection.value;
    this.vesselValue = { vessel: selection.item?.vesselName || '' };
  }

  onVoyageChange(selection: ComboboxSelection): void {
    this.searchModel.voyageId = selection.item.voyageNo;
  }

  onPaymentValueChange(value: unknown): void {
    if (value === null || value === undefined || value === '') {
      this.onPaymentChange(value, null);
    }
  }

  onCheckOutstanding(): void {
    const payload = {
      source: this.docInward ? 'DocSys' : 'Glossys',
      customerNames: [this.searchModel.customerName || ''],
    };

    this.apiService.post('api/receiptCheckOutstanding', payload).subscribe({
      next: (res: any) => {
        this.outstandingRecords = res || [];
        this.isOutstandingModalOpen = true;
      },
      error: (error) => {
        this.alert.showAlert(
          'Error',
          error?.error?.message || 'Unable to retrieve outstanding items.',
          'error',
        );
      },
    });
  }

  onSearchClick(): void {
    const invNo = this.searchModel.invoiceNo?.trim() || '';
    const blNo = this.searchModel.blNo?.trim() || '';
    const vessel = this.vesselValue?.vessel || '';
    const voyage = this.searchModel.voyageId || '';
    const customer = this.searchModel.customerName?.trim() || '';

    if (!invNo && !blNo && !vessel && !voyage && !customer) {
      this.alert.showAlert('Warning', 'Please enter search criterias to search.', 'warning');
      return;
    }

    if (vessel && !voyage) {
      this.alert.showAlert('Warning', 'Please choose the voyage no.', 'warning');
      return;
    }

    let source = 'Combine';
    if (this.docInward && !this.docOutward) {
      source = 'DocSys';
    } else if (!this.docInward && this.docOutward) {
      source = 'Glossys';
    }

    const payload = {
      invoiceNo: invNo,
      blNo: blNo,
      vesselName: vessel,
      voyageNo: voyage,
      customerName: customer,
    };

    console.log(payload);

    this.apiService.post('api/receiptRetrieve', payload).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.handleApiResponse(res);
        } else {
          this.alert.showAlert('Information', res?.message || 'No records found.', 'info');
          this.gridData = [];
          this.showReferenceType = false;
        }
      },
      error: (error) => {
        this.alert.showAlert(
          'Error',
          error?.error?.message || 'Unable to retrieve records.',
          'error',
        );
      },
    });
  }

  private handleApiResponse(res: any): void {
    const invoices = res.invoices || [];
    const outstandings = res.outstandings || [];

    this.gridData = [...invoices, ...outstandings];
    this.selectedGridRows = [];

    this.showReferenceType = this.gridData.length > 0;
    this.calculateSummary();
  }

  private buildReceiptPayload(): ReceiptApiPayload | null {
    const amount = this.toNumber(this.formData.amount);
    const bankCharge = this.toNumber(this.formData.bankCharges);
    const bank = this.getAccountName();
    const user = this.userService.getUser()?.username || 'admin';

    if (
      !this.selectedPayment ||
      !this.formData.chequeNo.trim() ||
      !bank ||
      amount <= 0 ||
      bankCharge < 0
    ) {
      this.alert.showAlert(
        'Validation Error',
        'Please enter a valid payment mode, reference number, account, and amount.',
        'error',
      );
      return null;
    }

    // if (!this.selectedGridRows || this.selectedGridRows.length === 0) {
    //   this.alert.showAlert(
    //     'Validation Error',
    //     'Please select at least one row from the table.',
    //     'warning',
    //   );
    //   return null;
    // }

    const mappedInvoices: ReceiptInvoicePayload[] = this.selectedGridRows.map((item) => ({
      selected: true,
      source: item.source || (this.docInward ? 'DocSys' : 'Doc4All'),
      blNo: item.bl_no || this.searchModel.blNo || '',
      vesselCode: item.vessel_code || '',
      vesselName: item.vessel_name || '',
      voyageNo: item.voyage_no || '',
      customerName: item.customer_name || this.searchModel.customerName || '',
      type: item.type || 'Invoice',
      referenceDate: item.reference_date || this.formData.receiptDate,
      referenceNo: item.reference_no || '',
      currency: item.currency || this.formData.currency,
      settlementAmount: this.toNumber(item.settlement_amt ?? item.settlementAmount),
      valueDoc: this.toNumber(item.sgd_amount ?? item.valueDoc ?? item.settlement_amt),
      valueDual: this.toNumber(item.usd_amount ?? item.valueDual),
      originalSgd: this.toNumber(item.original_sgd ?? item.originalSgd),
      originalUsd: this.toNumber(item.original_usd ?? item.originalUsd),
      partial: !!item.partial,
      writeoff: !!(item.write_off ?? item.writeoff),
    }));

    return {
      paymentMode:
        this.selectedPayment.name === 'T/T' ? 'T/T' : this.selectedPayment.name.toUpperCase(),
      officeCode: this.getOfficeCode(),
      referenceNo: this.formData.chequeNo,
      currencyCode: this.formData.currency,
      amount: amount,
      bankCharge: bankCharge,
      paidInvoiceTotal: this.toNumber(this.summary.paidInvoiceTotal),
      receiptTotal: this.toNumber(this.summary.receiptTotal) || amount,
      balanceAmount: Math.abs(this.toNumber(this.summary.balance)),
      bank: bank,
      createdUser: user,
      modifiedUser: user,
      invoices: mappedInvoices,
    };
  }

  onConfirm(): void {
    const payload = this.buildReceiptPayload();
    if (!payload) return;

    this.apiService.post('api/receipts/confirm-payment', payload).subscribe({
      next: () => {
        this.alert.showAlert('Success', 'Receipt confirmed successfully.', 'success');
        this.router.navigate(['/home/receipts']);
      },
      error: (error) => {
        this.alert.showAlert(
          'Error',
          error?.error?.message || 'Unable to confirm receipt.',
          'error',
        );
      },
    });
  }

  onOverPayment(): void {
    const payload = this.buildReceiptPayload();
    if (!payload) return;

    if (!this.isOverPaymentDisabled) {
      this.isMessageShow = true;
      return;
    }
    this.onConfirmRequest();
  }

  onConfirmRequest() {
    const payload = this.buildReceiptPayload();
    this.apiService.post('api/receipts/over-payment', payload).subscribe({
      next: (res: any) => {
        this.alert.showAlert('Success', 'Overpayment processed successfully.', 'success');
        this.router.navigate(['/home/receipts']);
      },
      error: (error) => {
        this.alert.showAlert(
          'Error',
          error?.error?.message || 'Unable to process overpayment.',
          'error',
        );
      },
    });
  }

  onCancelRequest() {
    this.isMessageShow = false;
  }

  submitReceipt(form: any) {
    if (form.invalid) return;
    this.onConfirm();
  }

  onCancel() {
    this.router.navigate(['/home/receipts']);
  }

  onRowSelect(selectedRecords: any): void {
    this.selectedGridRows = Array.isArray(selectedRecords)
      ? selectedRecords
      : selectedRecords
        ? [selectedRecords]
        : [];

    this.calculateSummary();
  }

  private toNumber(value: string | number): number {
    const number = Number(String(value ?? 0).replace(/,/g, ''));
    return Number.isFinite(number) ? number : 0;
  }

  private formatCurrency(val: number): string {
    return val.toLocaleString('en-SG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  formatMoney(field: 'amount' | 'bankCharges'): void {
    const value = this.formData[field];
    if (!String(value).trim()) return;

    const amount = this.toNumber(value);
    this.formData[field] = this.formatCurrency(amount);
  }

  calculateSummary(): void {
    const amount = this.toNumber(this.formData.amount);
    const bankCharges = this.toNumber(this.formData.bankCharges);

    const selectedSettlementTotal = this.selectedGridRows.reduce((sum, item) => {
      return sum + this.toNumber(item.settlement_amt ?? item.settlementAmount ?? item.sgd_amount);
    }, 0);

    this.summary.paidInvoiceTotal = this.formatCurrency(selectedSettlementTotal);
    this.summary.receiptTotal = this.formatCurrency(amount);

    // .NET formula: Abs((Amount + BankCharges) - PaidInvoiceTotal)
    const balance = Math.abs(amount + bankCharges - selectedSettlementTotal);
    this.summary.balance = this.formatCurrency(balance);
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private getAccountName(): string {
    return (
      this.accounts.find((account) => String(account.id) === String(this.formData.account))?.name ||
      ''
    );
  }

  private getOfficeCode(): string {
    try {
      const location = JSON.parse(localStorage.getItem('defaultLocation') || '{}');
      return location.officeCode.slice(0, 3) || location.locationName || 'SIN';
    } catch {
      return 'SIN';
    }
  }

  changePage(page: number): void {
    this.currentPage = page;
  }
}
