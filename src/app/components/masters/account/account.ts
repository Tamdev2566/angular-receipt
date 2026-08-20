import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ColumnDef, DataGrid } from '../../../shared/data-grid/data-grid';
import { IconButton } from '../../../shared/icon-button/icon-button';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog';
import { UserService } from '../../../services/userService/user.service';
import { AlertService } from '../../../services/alertService/alert';
import { MenuAccessService } from '../../../services/menu-access';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, DataGrid, IconButton, ConfirmDialogComponent],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private userService = inject(UserService);
  private alert = inject(AlertService);
  private menuAccessService = inject(MenuAccessService);
  private apiservice = inject(ApiService);
  private http = inject(HttpClient);

  datePipe = new DatePipe('en-US');

  formData = {
    accountCode: '',
    accountDisplayName: '',
    currency: '',
    paymentMode: '',
    isValid: '1',
  };

  errors: { [key: string]: boolean } = {};
  isSubmitted = false;
  editingId: string | null = null;
  gridData: any[] = [];

  gridColumns: ColumnDef[] = [
    { label: 'Office Code', field: 'officeCode', width: '120px' },
    { label: 'Acc Code', field: 'accountCode', width: '140px' },
    { label: 'Acc Display Name', field: 'accountDisplayName', width: '200px' },
    { label: 'Currency', field: 'accountCurrency', width: '100px' },
    { label: 'Payment Mode', field: 'accountPaymentMode', width: '130px' },
    { label: 'Status', field: 'isValid', width: '100px' },
    { label: 'Created By', field: 'userCreated', width: '100px' },
    { label: 'Created Date', field: 'dateCreated', width: '100px' },
  ];

  showConfirmDialog: boolean = false;
  confirmTitle: string = '';
  confirmMessage: string = '';
  confirmAction: (() => void) | null = null;

  get isSaveAllowed(): boolean {
    return this.menuAccessService.currentPermission()?.fullAccess || true;
  }

  ngOnInit(): void {
    this.menuAccessService.checkPermissionForUrl(this.router.url);
    this.loadData();
  }

  loadData(): void {
    this.apiservice
      .get(`api/master-accounts/list`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.gridData = res.data || [];
        },
        error: (err) => {
          this.alert.showAlert('Error', err.error?.message || 'Failed to load data', 'error');
        },
      });
  }

  validateFields(): boolean {
    const accountStr = this.formData.accountCode ? String(this.formData.accountCode) : '';
    const nameStr = this.formData.accountDisplayName
      ? String(this.formData.accountDisplayName)
      : '';
    const currencyStr = this.formData.currency ? String(this.formData.currency) : '';
    const paymentModeStr = this.formData.paymentMode ? String(this.formData.paymentMode) : '';

    this.errors['accountCode'] = !accountStr.trim();
    this.errors['accountDisplayName'] = !nameStr.trim();
    this.errors['currency'] = !currencyStr.trim();
    this.errors['paymentMode'] = !paymentModeStr.trim();

    const hasErrors = Object.values(this.errors).some((error) => error === true);
    return !hasErrors;
  }

  onSave(): void {
    this.isSubmitted = true;

    if (!this.validateFields()) {
      return;
    }

    const user = this.userService.getUser();
    const currentUser = user?.name || 'prabhu';

    const payload: any = {
      accountCurrency: this.formData.currency,
      accountPaymentMode: this.formData.paymentMode,
      accountCode: this.formData.accountCode,
      accountDisplayName: this.formData.accountDisplayName,
      accountSeq: 1,
      isValid: '1',
      userCreated: currentUser,
    };

    if (this.editingId) {
      this.apiservice
        .put(`api/master-accounts/update/${this.editingId}`, payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res: any) => {
            if (res.status === 'SUCCESS') {
              this.alert.showAlert('Success', res.message, 'success');
            } else {
              this.alert.showAlert('Error', res.message, 'error');
            }
            this.onCancel();
            this.loadData();
          },
          error: (err) => {
            this.alert.showAlert('Error', err.error?.message || 'Update failed', 'error');
          },
        });
    } else {
      this.apiservice
        .post(`api/master-accounts/add`, payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res: any) => {
            this.alert.showAlert(
              'Success',
              res?.message || 'Account added successfully!',
              'success',
            );
            this.onCancel();
            this.loadData();
          },
          error: (err) => {
            this.alert.showAlert('Error', err.error?.message || 'Save failed', 'error');
          },
        });
    }
  }

  onCancel(): void {
    this.isSubmitted = false;
    this.errors = {};
    this.editingId = null;

    this.formData = {
      accountCode: '',
      accountDisplayName: '',
      currency: '',
      paymentMode: '',
      isValid: '1',
    };
  }

  viewDetails(row: any): void {
    this.editingId = row.accountId;

    this.formData = {
      accountCode: row.accountCode || '',
      accountDisplayName: row.accountDisplayName || '',
      currency: row.accountCurrency || '',
      paymentMode: row.accountPaymentMode || '',
      isValid: row.isValid,
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleStatus(row: any): void {
    const newIsValid = row.isValid === '1' ? '0' : '1';
    const actionText = newIsValid === '1' ? 'Activate' : 'Deactivate';

    this.confirmTitle = 'Confirm Action';
    this.confirmMessage = `Are you sure you want to ${actionText} this account?`;

    this.confirmAction = () => {
      const payload = {
        accountCurrency: row.accountCurrency,
        accountPaymentMode: row.accountPaymentMode,
        accountCode: row.accountCode,
        accountDisplayName: row.accountDisplayName,
        accountSeq: row.accountSeq,
        isValid: newIsValid,
        accountId: row.accountId,
      };

      this.apiservice
        .put(`api/master-accounts/update/${row.accountId}`, payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.alert.showAlert('Success', `Account ${actionText}d successfully`, 'success');
            this.loadData();
          },
          error: (err) => {
            this.alert.showAlert('Error', err.error?.message || 'Failed to update status', 'error');
          },
        });
    };

    this.showConfirmDialog = true;
  }

  deleteAccount(row: any): void {
    this.confirmTitle = 'Confirm Delete';
    this.confirmMessage = 'Are you sure you want to delete this account?';

    this.confirmAction = () => {
      const user = this.userService.getUser();
      const currentUser = user?.name;
      const rowId = row.accountId;

      this.apiservice
        .delete(`api/master-accounts/delete/${rowId}?userId=${currentUser}`)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res: any) => {
            if (res.status === 'SUCCESS') {
              this.alert.showAlert('Success', res.message, 'success');
              this.loadData();
            } else {
              this.alert.showAlert('Error', res.message, 'error');
            }
          },
          error: (err) => {
            this.alert.showAlert('Error', err.error?.message || 'Failed to delete record', 'error');
          },
        });
    };

    this.showConfirmDialog = true;
  }

  onConfirmYes(): void {
    if (this.confirmAction) {
      this.confirmAction();
    }
    this.closeConfirmDialog();
  }

  onConfirmNo(): void {
    this.closeConfirmDialog();
  }

  closeConfirmDialog(): void {
    this.showConfirmDialog = false;
    this.confirmAction = null;
  }
}
