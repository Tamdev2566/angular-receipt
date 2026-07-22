import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Combobox, ComboboxSelection } from '../../shared/combobox/combobox';
import { UserService } from '../../services/userService/user.service';
import { AlertService } from '../../services/alertService/alert';
import { ChequeService } from './service/undo-cheque-service';

export interface RetrieveState {
  chequeNo: string | number;
  fullCheque: string | number;
}

export interface ChequeDetails {
  bound: string;
  bank_name: string;
  scan_user_id: string;
}

@Component({
  selector: 'app-undo-cheque',
  standalone: true,
  imports: [CommonModule, FormsModule, Combobox],
  templateUrl: './undo-cheque.html',
  styleUrls: ['./undo-cheque.scss'],
})
export class UndoCheque {
  private router = inject(Router);
  private loginUser = inject(UserService);
  private chequeService = inject(ChequeService);
  private alert = inject(AlertService);

  isRetrieveSubmitted = false;
  isUndoSubmitted = false;

  retrieve: RetrieveState = { chequeNo: '', fullCheque: '' };
  chequeDetails: ChequeDetails = { bound: '', bank_name: '', scan_user_id: '' };
  undo = { remark: '' };
  fullchequeBody = { chequeNo: '' };
  isSubmitted = false;

  retrieveCheque(retrieveForm: NgForm): void {
    this.isRetrieveSubmitted = true;

    if (!this.retrieve.chequeNo && !this.retrieve.fullCheque) {
      return;
    }

    if (retrieveForm && retrieveForm.invalid) {
      retrieveForm.form.markAllAsTouched();
      return;
    }

    this.chequeService
      .searchCheque(String(this.retrieve.chequeNo), String(this.retrieve.fullCheque))
      .subscribe({
        next: (res: any) => {
          this.chequeDetails = res ?? { bound: '', bank_name: '', scan_user_id: '' };
        },
        error: (err: any) => {
          this.alert.showAlert('Error', err?.error || 'Failed to search cheque', 'error');
        },
      });
  }

  undoCheque(undoForm: NgForm): void {
    this.isUndoSubmitted = true;

    if (undoForm.invalid) {
      undoForm.form.markAllAsTouched();
      return;
    }

    const payload = {
      chequeNo: String(this.retrieve.chequeNo || ''),
      fullChequeNo: String(this.retrieve.fullCheque || ''),
      remark: this.undo.remark.trim(),
      userId: String(this.loginUser.getUser()?.name || ''),
    };

    this.chequeService.undoCheque(payload).subscribe({
      next: (res: any) => {
        this.alert.showAlert('Success', res?.message || 'Cheque undone successfully', 'success');
        this.onCancel(undoForm);
      },
      error: (err: any) => {
        console.error('Failed to undo cheque', err);
        this.alert.showAlert('Error', err?.error.message || 'Failed to undo cheque', 'error');
      },
    });
  }

  onCancel(undoForm?: NgForm): void {
    this.isRetrieveSubmitted = false;
    this.isUndoSubmitted = false;

    if (undoForm) {
      undoForm.resetForm();
    }

    this.retrieve = { chequeNo: '', fullCheque: '' };
    this.chequeDetails = { bound: '', bank_name: '', scan_user_id: '' };
    this.undo = { remark: '' };
    this.fullchequeBody = { chequeNo: '' };
  }

  onChequeChange(value: any, item: any): void {
    this.fullchequeBody = { chequeNo: item?.name ?? '' };
  }

  onBackToLists(): void {
    this.router.navigate(['/home/user-mgt-list']);
  }

  onChequeNoSelect(event: ComboboxSelection): void {
    this.retrieve.chequeNo = event.item?.name;
    if (event.item) {
      this.fullchequeBody = { chequeNo: event.item?.name ?? '' };
    } else {
      this.retrieve.fullCheque = '';
    }
  }

  onFullChequeSelect(event: ComboboxSelection): void {
    this.retrieve.fullCheque = event.item.name;
  }
}
