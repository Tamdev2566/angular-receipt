import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Combobox, ComboboxSelection } from '../../../shared/combobox/combobox';
import { DatepickerComponent } from '../../../shared/date-picker/date-picker';
import { ColumnDef, DataGrid } from '../../../shared/data-grid/data-grid';
import { ApiService } from '../../../services/api.service';
import { AlertService } from '../../../services/alertService/alert';
import { UserService } from '../../../services/userService/user.service';

interface CreateReceiptPayload {
  transactionDate: string;
  officeCode: string;
  paymentMode: string;
  receiptDate: string;
  referenceNo: string;
  currencyCode: string;
  amount: number;
  bankCharge: number;
  paidInvoiceTotal: number;
  receiptTotal: number;
  balanceAmount: number;
  postedToCoda: boolean;
  bank: string;
  createdUser: string;
  modifiedUser: string;
}

interface AccountOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-new-receipt',
  imports: [CommonModule, FormsModule, Combobox, DatepickerComponent, DataGrid],
  templateUrl: './new-receipts.html',
  styleUrls: ['./new-receipts.scss'],
})
export class NewReceiptComponent {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  docInward = true;
  docOutward = true;
  selectedPayment: any = null;

  loading = false;
  isEditMode = false;
  submitted = false;

  vesselList: any[] = [];
  voyageList: any[] = [];

  gridData: any[] = [];

  paginatedRecords: any[] = [];

  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 20;
  pageNumbers: number[] = [];
  selectedRecord: any = null;
  searchText = '';
  selectedVesselName = '';
  vesselValue = {};

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
  ];

  searchModel = {
    invoiceNo: '',
    blNo: '',
    vesselId: null,
    voyageId: null,
    customerName: '',
  };

  newRecord = {
    id: '',
    invoiceNo: '',
    customerName: '',
    blNo: '',
    chequeNo: 'CASH',
    vesselName: '',
    voyageNo: '',
    date: new Date().toISOString().substring(0, 10),
    amount: 0,
    currency: 'SGD',
    payMode: 'Cash',
    status: 'Unverified',
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

  gridColumns: ColumnDef[] = [
    { label: 'Reference No', field: 'reference_no', width: '130px' },
    { label: 'Reference Date', field: 'reference_date', width: '120px' },
    { label: 'BL No', field: 'bl_no', width: '130px' },
    { label: 'Currency', field: 'currency', align: 'center', width: '90px' },
    { label: 'Settlement Amount', field: 'settlement_amount', width: '140px' },
    { label: 'SGD Amount', field: 'sgd_amount', width: '120px' },
    { label: 'USD Amount', field: 'usd_amount', width: '120px' },
    { label: 'Original SGD', field: 'original_sgd', width: '120px' },
    { label: 'Original USD', field: 'original_usd', width: '120px' },
    { label: 'Partial', field: 'partial', width: '90px' },
    { label: 'Write-off', field: 'write_off', width: '90px' },
  ];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private alertService: AlertService,
    private userService: UserService,
  ) {}

  // ngOnInit(): void {
  //   if (this.formData.paymentMode === 'Cash') {
  //     this.formData.chequeNo = 'Cash';
  //   } else {
  //     this.formData.chequeNo = '';
  //   }
  // }\

  ngOnInit() {
    this.formData.receiptDate = this.today();

    this.vesselList = [
      {
        vessel_id: 1,
        vessel_name: 'SINAR AMBON',
      },
      {
        vessel_id: 2,
        vessel_name: 'SINAR BALI',
      },
    ];

    this.voyageList = [
      {
        voyage_id: 1,
        voyage_no: 'TESTVGM2',
      },
      {
        voyage_id: 2,
        voyage_no: 'TESTVGM3',
      },
    ];
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

  onPaymentValueChange(value: unknown): void {
    if (value === null || value === undefined || value === '') {
      this.onPaymentChange(value, null);
    }
  }

  onCheckOutstanding(): void {
    this.currentPage = 1;
    this.selectedRecord = null;

    // Outstanding-record retrieval is not available in the current API contract.
    // Keep the entered filters intact so they can be submitted when that endpoint is added.
  }

  onSearchClick() {
    // Check if at least one field has a value
    const hasValue =
      this.searchModel.invoiceNo?.trim() ||
      this.searchModel.blNo?.trim() ||
      this.searchModel.vesselId ||
      this.searchModel.customerName?.trim() ||
      this.searchModel.voyageId;

    if (!hasValue) {
      this.alertService.showAlert(
        'Validation',
        'You must fill at least one field to search.',
        'warning',
      );
      return;
    }

    const payload = {
      invoiceNo: this.searchModel.invoiceNo || '',
      blNo: this.searchModel.blNo || '',
      vesselId: this.searchModel.vesselId || '',
      customerName: this.searchModel.customerName || '',
      voyageId: this.searchModel.voyageId || '',
    };

    console.log('Payload:', payload);

    this.loading = true;

    this.apiService
      .post('api/receiptRetrieve', payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          console.log('res', res);
        },
        error: (error) => {
          this.alertService.showAlert(
            'Error',
            error?.error?.message || 'Unable to retrieve receipt.',
            'error',
          );
        },
      });
  }

  onOverPayment() {
    // const payload = {
    //   transactionDate: '2026-07-13',
    //   officeCode: 'SIN',
    //   paymentMode: 'CASH',
    //   receiptDate: '2026-07-10',
    //   referenceNo: 'REF000008',
    //   currencyCode: 'SGD',
    //   amount: 2500.0,
    //   bankCharge: 0,
    //   paidInvoiceTotal: 2500.0,
    //   receiptTotal: 2500.0,
    //   balanceAmount: 0.0,
    //   postedToCoda: false,
    //   bank: 'DBS',
    //   createdUser: 'admin',
    //   modifiedUser: 'admin',
    // };
    // this.apiService.post('api/receipts', payload).subscribe({
    //   next: (response: any) => {
    //     console.log('Receipt Created:', response);
    //   },
    //   error: (error: any) => {
    //     console.error('API Error:', error);
    //   },
    // });
  }

  submitReceipt(formValue: any) {
    console.log('formValue', formValue);

    if (!this.newRecord.customerName || !this.newRecord.invoiceNo || !this.newRecord.amount) {
      alert('Mandatory form attributes entry missing!');
      return;
    }
    this.newRecord.id = `REC-${Math.floor(100 + Math.random() * 900)}`;
    this.save.emit({ ...this.newRecord });
    this.close.emit();
  }

  onSaveUser(form: NgForm): void {
    this.submitted = true;
    if (form.invalid) {
      return;
    }

    this.onConfirm();
  }

  onCancel() {
    this.router.navigate(['/home/receipts']);
  }

  onConfirm(): void {
    if (this.loading) {
      return;
    }

    const amount = this.toNumber(this.formData.amount);
    const bankCharge = this.toNumber(this.formData.bankCharges);
    const receiptDate = this.toApiDate(this.formData.receiptDate);
    const bank = this.getAccountName();

    if (
      !this.selectedPayment ||
      !this.formData.chequeNo.trim() ||
      !receiptDate ||
      !bank ||
      amount <= 0 ||
      bankCharge < 0
    ) {
      this.alertService.showAlert(
        'Error',
        'Please enter a receipt date, payment type, account, reference number, and a valid amount.',
        'error',
      );
      return;
    }

    const user = this.userService.getUser();
    const username = user?.username || user?.userName || user?.name || user?.email || 'admin';
    const payload: CreateReceiptPayload = {
      transactionDate: this.today(),
      officeCode: this.getOfficeCode(),
      paymentMode: this.selectedPayment.name.toUpperCase(),
      receiptDate,
      referenceNo: 'REF000006',
      currencyCode: this.formData.currency,
      amount,
      bankCharge,
      paidInvoiceTotal: this.toNumber(this.summary.paidInvoiceTotal),
      receiptTotal: this.toNumber(this.summary.receiptTotal) || amount,
      balanceAmount: this.toNumber(this.summary.balance),
      postedToCoda: false,
      bank,
      createdUser: 'admin',
      modifiedUser: 'admin',
    };

    this.loading = true;
    this.apiService
      .post('api/receipts', payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.alertService.showAlert('Success', 'Receipt created successfully.', 'success');
          this.router.navigate(['/home/receipts']);
        },
        error: (error) => {
          this.alertService.showAlert(
            'Error',
            error?.error?.message || 'Unable to create the receipt.',
            'error',
          );
        },
      });
  }

  private toNumber(value: string | number): number {
    const number = Number(String(value).replace(/,/g, ''));
    return Number.isFinite(number) ? number : 0;
  }

  formatMoney(field: 'amount' | 'bankCharges'): void {
    const value = this.formData[field];

    if (!String(value).trim()) {
      return;
    }

    const amount = this.toNumber(value);
    this.formData[field] = amount.toLocaleString('en-SG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  calculateSummary(): void {
    const amount = this.toNumber(this.formData.amount);

    this.summary.paidInvoiceTotal = amount.toLocaleString('en-SG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    this.summary.receiptTotal = amount.toLocaleString('en-SG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    this.summary.balance = '0.00';
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }

  /** Converts the shared date picker value (DD/MM/YYYY) to the API's YYYY-MM-DD format. */
  private toApiDate(value: string): string {
    const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

    if (match) {
      const [, day, month, year] = match;
      return `${year}-${month}-${day}`;
    }

    return /^\d{4}-\d{2}-\d{2}$/.test(value.trim()) ? value.trim() : '';
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
      return location.locationName || '';
    } catch {
      return '';
    }
  }

  changePage(page: number): void {
    //   if (!this.searchText && page >= 1) {
    //     this.currentPage = page;
    //     this.loadUserLedger();
    //   } else {
    //     this.currentPage = page;
    //     this.searchUsers();
    //   }
  }

  onRowSelect(record: any): void {
    this.trackSelectionLogs();
    console.log('record', record);
    // this.rowData.setRowData(record);
  }

  trackSelectionLogs(): void {
    const selectedRows = this.paginatedRecords.filter((row) => row.isSelected);

    this.selectedRecord = selectedRows.length === 1 ? selectedRows[0] : null;
  }
}
