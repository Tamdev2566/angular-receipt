import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
  selector: 'app-bank',
  standalone: true,
  imports: [CommonModule, FormsModule, DataGrid, IconButton, ConfirmDialogComponent],
  templateUrl: './bank.html',
  styleUrl: './bank.scss',
})
export class Bank implements OnInit {
  private router = inject(Router);
  private userService = inject(UserService);
  private alert = inject(AlertService);
  private menuAccessService = inject(MenuAccessService);
  private apiservice = inject(ApiService);
  private http = inject(HttpClient);

  datePipe = new DatePipe('en-US');

  formData = {
    bankCode: '',
    bankName: '',
    bankDescription: '',
    isValid: '1',
  };

  errors: { [key: string]: boolean } = {};
  isSubmitted = false;
  editingId: string | null = null;
  gridData: any[] = [];

  // Updated Grid Columns
  gridColumns: ColumnDef[] = [
    { label: 'Office Code', field: 'officeCode', width: '120px' },
    { label: 'Bank Code', field: 'bankCode', width: '140px' },
    { label: 'Bank Name', field: 'bankName', width: '200px' },
    { label: 'Description', field: 'bankDescription', width: '250px' },
    { label: 'Status', field: 'isValid', width: '100px' },
    { label: 'Created By', field: 'userCreated', width: '120px' },
    { label: 'Created Date', field: 'dateCreated', width: '120px' },
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
    this.apiservice.get(`api/master-banks/list`).subscribe({
      next: (res: any) => {
        const response = res.data.map((r: any) => ({
          ...r,
          dateCreated: this.datePipe.transform(r.dateCreated, 'dd-MM-yyyy'),
        }));
        this.gridData = response || [];
      },
      error: (err) => {
        this.alert.showAlert('Error', err.error?.message || 'Failed to load data', 'error');
      },
    });
  }

  validateFields(): void {
    const bankCodeStr = this.formData.bankCode ? String(this.formData.bankCode) : '';
    const bankNameStr = this.formData.bankName ? String(this.formData.bankName) : '';
    const bankDescStr = this.formData.bankDescription ? String(this.formData.bankDescription) : '';

    this.errors['bankCode'] = !bankCodeStr.trim();
    this.errors['bankName'] = !bankNameStr.trim();
    this.errors['bankDescription'] = !bankDescStr.trim();
  }

  onSave(): void {
    this.isSubmitted = true;
    this.validateFields();

    const hasErrors = Object.values(this.errors).some((error) => error === true);
    if (hasErrors) {
      return;
    }

    const user = this.userService.getUser();
    const currentUser = user?.name || 'prabhu';

    const payload: any = {
      bankCode: this.formData.bankCode,
      bankName: this.formData.bankName,
      bankDescription: this.formData.bankDescription,
      isValid: this.formData.isValid,
      userCreated: currentUser,
    };

    if (this.editingId) {
      payload.bankId = this.editingId;

      this.apiservice.put(`api/master-banks/update/${this.editingId}`, payload).subscribe({
        next: (res: any) => {
          if (res.status === 'SUCCESS' || res.message) {
            this.alert.showAlert('Success', 'Bank updated successfully!', 'success');
          }
          this.onCancel();
          this.loadData();
        },
        error: (err) => {
          this.alert.showAlert('Error', err.error?.message || 'Update failed', 'error');
        },
      });
    } else {
      this.apiservice.post(`api/master-banks/add`, payload).subscribe({
        next: () => {
          this.alert.showAlert('Success', 'Bank added successfully!', 'success');
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
      bankCode: '',
      bankName: '',
      bankDescription: '',
      isValid: '1',
    };
  }

  viewDetails(row: any): void {
    this.editingId = row.bankId;

    this.formData = {
      bankCode: row.bankCode || '',
      bankName: row.bankName || '',
      bankDescription: row.bankDescription || '',
      isValid: row.isValid,
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleStatus(row: any): void {
    const newIsValid = row.isValid === '1' ? '0' : '1';
    const actionText = newIsValid === '1' ? 'Activate' : 'Deactivate';

    this.confirmTitle = 'Confirm Action';
    this.confirmMessage = `Are you sure you want to ${actionText} this bank?`;

    this.confirmAction = () => {
      const payload = {
        bankCode: row.bankCode,
        bankName: row.bankName,
        bankDescription: row.bankDescription,
        isValid: newIsValid,
        bankId: row.bankId,
      };

      const rowId = row.bankId;

      this.apiservice.put(`api/master-banks/update/${rowId}`, payload).subscribe({
        next: () => {
          this.alert.showAlert('Success', `Bank ${actionText}d successfully`, 'success');
          this.loadData();
        },
        error: (err) => {
          this.alert.showAlert('Error', err.error?.message || 'Failed to update status', 'error');
        },
      });
    };

    this.showConfirmDialog = true;
  }

  deleteBank(row: any): void {
    this.confirmTitle = 'Confirm Delete';
    this.confirmMessage = 'Are you sure you want to delete this bank?';

    this.confirmAction = () => {
      const user = this.userService.getUser();
      const currentUser = user?.name;
      const rowId = row.bankId;

      this.apiservice.delete(`api/master-banks/delete/${rowId}?userId=${currentUser}`).subscribe({
        next: (res: any) => {
          this.alert.showAlert('Success', 'Bank deleted successfully', 'success');
          this.loadData();
        },
        error: (err) => {
          this.alert.showAlert('Error', err.error?.message || 'Failed to delete record', 'error');
        },
      });
    };

    this.showConfirmDialog = true;
  }

  onConfirmYes(): void {
    if (this.confirmAction) this.confirmAction();
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
