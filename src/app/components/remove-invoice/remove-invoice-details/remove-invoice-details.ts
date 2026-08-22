import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alertService/alert';
import { MenuAccessService } from '../../../services/menu-access';
import { UndoService } from '../../../services/undoServices/undo-service';
import { UserService } from '../../../services/userService/user.service';
import { ColumnDef, DataGrid } from '../../../shared/data-grid/data-grid';
import { RemoveInvoiceService } from '../service/remove-invoice-service';

@Component({
  selector: 'app-remove-invoice-details',
  imports: [CommonModule, FormsModule, DataGrid],
  templateUrl: './remove-invoice-details.html',
  styleUrl: './remove-invoice-details.scss',
})
export class RemoveInvoiceDetails implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  paginatedRecords: any[] = [];
  selectedRecord: any = null;

  retrieve = {
    customerName: '',
    vesselName: '',
    voyageNo: '',
  };

  remark = '';

  invoiceGrid: any[] = [];
  loading: boolean = false;
  recordData = input<any>();

  invoiceColumns: ColumnDef[] = [
    { label: 'Type', field: 'type', width: '90px' },
    { label: 'Reference No', field: 'reference_no', width: '150px' },
    { label: 'Reference Date', field: 'reference_date', width: '150px' },
    { label: 'Vessel Name', field: 'vessel_name', width: '170px' },
    { label: 'Voyage No', field: 'voyage_no', width: '110px' },
    { label: 'SGD Amount', field: 'original_sgd', width: '120px' },
    { label: 'USD Amount', field: 'original_usd', width: '120px' },
  ];

  private menuAccessService = inject(MenuAccessService);

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private invoiceService: RemoveInvoiceService,
    private undogGlobalService: UndoService,
  ) {}

  get isCreateAllowed(): boolean {
    return this.menuAccessService.currentPermission().fullAccess;
  }

  get hasRetrieveValues(): boolean {
    return !!(
      this.retrieve.customerName?.trim() ||
      this.retrieve.vesselName?.trim() ||
      this.retrieve.voyageNo?.trim()
    );
  }

  ngOnInit() {
    this.undogGlobalService.currentRemoveInvoice
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((invoiceData) => {
        if (invoiceData?.['customer_name']) {
          this.retrieve.customerName = invoiceData['customer_name'];
          this.retrieve.vesselName = invoiceData['vessel_name'];
          this.retrieve.voyageNo = invoiceData['voyage_no'];

          this.invoiceService
            .searchInvoices(
              this.retrieve.customerName,
              this.retrieve.vesselName,
              this.retrieve.voyageNo,
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((res) => {
              this.invoiceGrid = res;
            });
        }
      });

    this.menuAccessService.checkPermissionForUrl(this.router.url);
  }

  retrieveInvoice() {
    this.invoiceService
      .searchInvoices(this.retrieve.customerName, this.retrieve.vesselName, this.retrieve.voyageNo)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.invoiceGrid = res;
      });
  }

  removeInvoice() {
    const selectedRecords = this.invoiceGrid.filter((row) => row.isSelected);

    if (selectedRecords.length === 0) {
      this.alertService.showAlert('Error', 'You must Select one Row', 'error');
      return;
    }

    if (!this.remark.trim()) {
      this.alertService.showAlert('Error', 'You must enter Remark', 'error');
      return;
    }

    const referenceNos = selectedRecords.map((row) => row.reference_no);
    const user = this.userService.getUser();

    this.invoiceService
      .removeInvoices(referenceNos, user.name, this.remark)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.alertService.showAlert('Success', res.message, 'success');
          this.onCancel();
          this.remark = '';
          this.retrieveInvoice();
          this.undogGlobalService.notifyReceiptActionCompleted();
        },
        error: (err) => {
          this.alertService.showAlert('Error', err.error.message, 'error');
        },
      });
  }
  onCancel() {
    // history.back();
    this.retrieve = {
      customerName: '',
      vesselName: '',
      voyageNo: '',
    };

    this.remark = '';
    this.invoiceGrid = [];
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
