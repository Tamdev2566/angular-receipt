import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../services/alertService/alert';
import { UserService } from '../../services/userService/user.service';
import { UpdateChequeService } from './service/update-cheque-service';
import { MenuAccessService } from '../../services/menu-access';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-cheque',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-cheque.html',
  styleUrls: ['./update-cheque.scss'],
})
export class UpdateCheque implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  loading = false;

  retrieve = {
    chequeNo: '',
  };

  receipt = {
    transactionNo: '',
    customerName: '',
    referenceNo: '',
    currency: '',
    amount: '',
    paidInvoiceTotal: '',
  };

  update = { newChequeNo: '', remark: '' };

  isSubmitted = false;
  private menuAccessService = inject(MenuAccessService);

  constructor(
    private updateChequeService: UpdateChequeService,
    private user: UserService,
    private alert: AlertService,
    private router: Router,
  ) {}

  get isUpdateAllowed(): boolean {
    return this.menuAccessService.currentPermission().fullAccess;
  }

  ngOnInit() {
    this.menuAccessService.checkPermissionForUrl(this.router.url);
  }

  retrieveCheque(): void {
    this.isSubmitted = true;

    if (!this.retrieve.chequeNo || !this.retrieve.chequeNo.trim()) {
      return;
    }

    this.isSubmitted = false;

    this.updateChequeService.searchCheque(this.retrieve.chequeNo.trim()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.receipt = {
          transactionNo: res.transaction_no || '',
          customerName: res.customer_name || '',
          referenceNo: res.reference_no || '',
          currency: res.currency_code || '',
          amount: res.amount !== undefined ? res.amount.toString() : '',
          paidInvoiceTotal:
            res.paid_invoice_total !== undefined ? res.paid_invoice_total.toString() : '',
        };
      },
      error: (err: any) => {
        this.alert.showAlert('Error', err.error?.message || 'Something went wrong!', 'error');
      },
    });
  }

  updateCheque(): void {
    if (!this.receipt.transactionNo) {
      this.alert.showAlert(
        'Error',
        'Please retrieve valid cheque details before updating.',
        'error',
      );
      return;
    }

    if (!this.update.newChequeNo.trim()) {
      this.alert.showAlert('Error', 'Please enter New Cheque Number', 'error');
      return;
    }

    const payload = {
      originalChequeNo: this.retrieve.chequeNo,
      newChequeNo: this.update.newChequeNo,
      transactionNo: this.receipt.transactionNo,
      remark: this.update.remark,
      userId: this.user.getUser().name,
    };

    this.updateChequeService.updateCheque(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.alert.showAlert('Success', 'Cheque Number Updated Successfully', 'success');
        this.onCancel();
      },
      error: (err) => {
        this.alert.showAlert('Error', err.error?.message || 'Something went wrong!', 'error');
      },
    });
  }

  onCancel(): void {
    this.isSubmitted = false;
    this.retrieve = {
      chequeNo: '',
    };

    this.receipt = {
      transactionNo: '',
      customerName: '',
      referenceNo: '',
      currency: '',
      amount: '',
      paidInvoiceTotal: '',
    };

    this.update = {
      newChequeNo: '',
      remark: '',
    };
  }
}
