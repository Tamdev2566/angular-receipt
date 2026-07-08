import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Combobox } from '../../../shared/combobox/combobox';
import { DatepickerComponent } from '../../../shared/date-picker/date-picker';
import { ColumnDef, DataGrid } from '../../../shared/data-grid/data-grid';

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

  formData = {
    paymentMode: '',
    chequeNo: '',
    date: '',
    currency: 'SGD',
    account: '',
    amount: '',
    bankCharges: '',
  };

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
    paidInvoiceTotal: '2166.35',
    receiptTotal: '0.00',
    balance: '2166.35',
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

  constructor(private router: Router) {}

  // ngOnInit(): void {
  //   if (this.formData.paymentMode === 'Cash') {
  //     this.formData.chequeNo = 'Cash';
  //   } else {
  //     this.formData.chequeNo = '';
  //   }
  // }\

  ngOnInit() {
    this.formData.date = new Date().toISOString().split('T')[0];

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

  ngDoCheck() {
    console.log('selectedPayment', this.selectedPayment);
    if (this.selectedPayment === null) {
      this.formData.chequeNo = '';
      this.formData.amount = '';
      this.formData.bankCharges = '';
    }
  }

  onPaymentChange(value: any, item: any): void {
    console.log(item);
    this.selectedPayment = item;

    if (item.name === 'Cash') {
      this.formData.chequeNo = 'Cash';
      this.formData.amount = '';
      this.formData.bankCharges = '';
    } else if (this.selectedPayment === null) {
      this.formData.chequeNo = '';
      this.formData.amount = '';
      this.formData.bankCharges = '';
    }

    console.log(this.formData);
  }

  onCheckOutstanding() {
    alert('Outstanding checked: Clean ledger state');
  }

  onOverPayment() {
    alert('Over payment threshold verified & registered');
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
    console.log('form', form);
  }

  onCancel() {
    this.router.navigate(['/home/receipts']);
  }

  onConfirm() {}

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
