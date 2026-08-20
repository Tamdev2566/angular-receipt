import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/userService/user.service';
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alertService/alert';
import { MenuAccessService } from '../../services/menu-access';
import { ColumnDef, DataGrid } from '../../shared/data-grid/data-grid';
import { IconButton } from '../../shared/icon-button/icon-button';
import { HttpClient } from '@angular/common/http';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-cheque-reader-info',
  standalone: true,
  imports: [CommonModule, FormsModule, DataGrid, IconButton, ConfirmDialogComponent],
  templateUrl: './cheque-reader-info.html',
  styleUrls: ['./cheque-reader-info.scss'],
})
export class ChequeReaderInfo implements OnInit {
  constructor(
    private router: Router,
    private userService: UserService,
    private apiService: ApiService,
    private alert: AlertService,
  ) {
    this.loadCurrentDate();
  }

  formData = {
    direction: 'INBOUND',
    date: '',
    fullCheque: '',
    cheque: '',
    bank: '',
    isValid: '1',
  };

  isSubmitted: boolean = false;
  editingId: number | null = null;

  gridData: any[] = [];

  gridColumns: ColumnDef[] = [
    { label: 'Id', field: 'id', width: '50px' },
    { label: 'Bank Name', field: 'bankName', width: '140px', align: 'center' },
    { label: 'Cheque No', field: 'chequeNo', width: '160px' },
    { label: 'Full Cheque No', field: 'fullChequeNo', width: '160px' },
    { label: 'Bound Type', field: 'bound', width: '160px', align: 'center' },
    { label: 'Created User', field: 'scanUserId', width: '120px' },
    { label: 'Created Date', field: 'createTime', width: '120px' },
  ];

  showConfirmDialog: boolean = false;
  confirmTitle: string = '';
  confirmMessage: string = '';
  confirmAction: (() => void) | null = null;

  private menuAccessService = inject(MenuAccessService);

  errors: { [key: string]: boolean } = {
    direction: false,
    fullCheque: false,
    cheque: false,
    bank: false,
  };

  chequeErrorMessage: string = '';

  validateCheque(): void {
    const chequeVal = this.formData.cheque ? this.formData.cheque.trim() : '';
    const chequeRegex = /^[A-Za-z]{1,10}\s\d{6}$/;

    if (!chequeVal) {
      this.errors['cheque'] = true;
      this.chequeErrorMessage = 'Cheque is required';
    } else if (!chequeRegex.test(chequeVal)) {
      this.errors['cheque'] = true;
      this.chequeErrorMessage = 'Format: Max 10 alphabets, 1 space, & 6 digits (e.g., SCB 100200)';
    } else {
      this.errors['cheque'] = false;
      this.chequeErrorMessage = '';
    }
  }

  validateForm(): void {
    this.errors['direction'] = !this.formData.direction;
  }

  validateBank(): void {
    const val = this.formData.bank ? this.formData.bank.trim() : '';
    this.errors['bank'] = !val;
  }

  get isSaveAllowed(): boolean {
    return this.menuAccessService.currentPermission().fullAccess;
  }

  ngOnInit() {
    this.menuAccessService.checkPermissionForUrl(this.router.url);
    this.loadData();
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

  loadData() {
    const payload = {};

    this.apiService.post('api/cheque/list', payload).subscribe({
      next: (res: any) => {
        this.gridData = res.data;
      },
      error: (err) => {
        this.alert.showAlert('Error', err.error.message, 'error');
      },
    });
  }

  validateFullCheque(): void {
    if (this.formData.fullCheque?.trim()) {
      this.errors['fullCheque'] = false;
    } else {
      this.errors['fullCheque'] = true;
    }
  }

  loadCurrentDate(): void {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const hh = String(hours).padStart(2, '0');

    this.formData.date = `${day}-${month}-${year} ${hh}:${minutes}:${seconds} ${ampm}`;
  }

  onSave(): void {
    this.isSubmitted = true;
    this.validateForm();
    this.validateFullCheque();
    this.validateCheque();
    this.validateBank();

    const hasError = Object.values(this.errors).some((err) => err);
    if (hasError) {
      return;
    }
    if (this.errors['fullCheque']) {
      return;
    }

    const user = this.userService.getUser();

    const payload: any = {
      boundOption:
        this.formData.direction === 'INBOUND'
          ? 'I'
          : this.formData.direction === 'OUTBOUND'
            ? 'O'
            : 'IO',
      // date: this.formData.date,
      fullChequeNo: this.formData.fullCheque,
      chequeNo: this.formData.cheque,
      bankName: this.formData.bank,
      uid: user.name,
      isValid: this.formData.isValid,
    };

    if (this.editingId) {
      payload.id = this.editingId;

      this.apiService.post('api/cheque/updateCheque', payload).subscribe({
        next: (res: any) => {
          this.alert.showAlert('Success', 'Record updated successfully!', 'success');
          this.onCancel();
          this.loadData();
        },
        error: (err) => {
          this.alert.showAlert('Error', err.error?.message || 'Update failed', 'error');
        },
      });
    } else {
      this.apiService.post('api/cheque/save', payload).subscribe({
        next: (res: any) => {
          this.alert.showAlert('Success', 'Record saved successfully!', 'success');
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
      direction: 'INBOUND',
      date: '',
      fullCheque: '',
      cheque: '',
      bank: '',
      isValid: '1',
    };
    this.loadCurrentDate();
  }

  viewDetails(row: any): void {
    this.editingId = row.id;

    this.formData = {
      direction: row.bound === 'I' ? 'INBOUND' : row.bound === 'O' ? 'OUTBOUND' : 'BOTH',
      date: row.createTime || this.formData.date,
      fullCheque: row.fullChequeNo || '',
      cheque: row.chequeNo || '',
      bank: row.bankName || '',
      isValid: row.isValid || '1',
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleStatus(row: any): void {
    const newIsValid = row.isValid === '1' ? '0' : '1';
    const actionText = newIsValid === '1' ? 'Activate' : 'Deactivate';

    this.confirmTitle = 'Confirm Action';
    this.confirmMessage = `Are you sure you want to ${actionText} this record?`;

    this.confirmAction = () => {
      const payload = {
        id: row.id,
        isValid: newIsValid,
      };

      this.apiService.post('api/cheque/updateCheque', payload).subscribe({
        next: (res: any) => {
          this.alert.showAlert('Success', `Record ${actionText}d successfully`, 'success');
          this.loadData();
        },
        error: (err) => {
          this.alert.showAlert('Error', err.error?.message || 'Failed to update status', 'error');
        },
      });
    };

    this.showConfirmDialog = true;
  }

  deleteApplication(appId: number | string): void {
    this.confirmTitle = 'Confirm Delete';
    this.confirmMessage =
      'Are you sure you want to delete this record? This action cannot be undone.';

    this.confirmAction = () => {
      const payload = { id: appId };

      this.apiService.post('api/cheque/updateCheque', payload).subscribe({
        next: (res: any) => {
          this.alert.showAlert('Success', 'Record deleted successfully', 'success');
          this.loadData();
        },
        error: (err) => {
          this.alert.showAlert('Error', err.error?.message || 'Failed to delete record', 'error');
        },
      });
    };

    this.showConfirmDialog = true;
  }
}
