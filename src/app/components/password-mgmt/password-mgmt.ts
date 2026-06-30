import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../services/alertService/alert';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/userService/user.service';

@Component({
  selector: 'app-password-mgmt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './password-mgmt.html',
  styleUrls: ['./password-mgmt.scss'],
})
export class PasswordMgmt implements OnInit {
  @Input() mode: 'forgot' | 'change' = 'forgot';
  @Output() close = new EventEmitter<void>();

  currentStep: 'selection' | 'enter-token' | 'change-password' = 'selection';
  oldPassword = '';
  token = '';
  newPassword = '';
  confirmPassword = '';
  isLoading = false;
  formSubmitted = false;

  constructor(
    private alert: AlertService,
    private apiService: ApiService,
    private user: UserService,
  ) {}

  ngOnInit() {
    if (this.mode === 'change') this.currentStep = 'change-password';
  }

  onSubmitPassword(form: any): void {
    this.formSubmitted = true;

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.alert.showAlert('Error', 'Passwords do not match', 'error');
      return;
    }

    this.isLoading = true;

    if (this.currentStep === 'change-password') {
      const payload = {
        userId: this.user.getUser().userId,
        XPWD: btoa(`${this.oldPassword}.${this.newPassword}.${this.confirmPassword}`),
      };

      this.apiService.post('changePassword', payload).subscribe({
        next: (resp: any) => {
          this.isLoading = false;

          if (
            resp === 'Changed Password Successfully' ||
            resp?.message === 'Changed Password Successfully'
          ) {
            this.alert.showAlert('Success', 'Changed Password Successfully', 'success');

            this.oldPassword = '';
            this.newPassword = '';
            this.confirmPassword = '';

            this.closeModal();
          } else {
            this.alert.showAlert('Warning', resp?.message || resp, 'warning');
          }
        },
        error: (err: any) => {
          this.isLoading = false;

          this.alert.showAlert(
            'Error',
            err?.error?.message || 'Unable to change password',
            'error',
          );
        },
      });

      return;
    }

    const resetPayload = {
      token: this.token,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
    };

    this.apiService.post('resetPassword', resetPayload).subscribe({
      next: () => {
        this.isLoading = false;

        this.alert.showAlert('Success', 'Password Reset Successfully', 'success');

        this.closeModal();
      },
      error: (err: any) => {
        this.isLoading = false;

        this.alert.showAlert('Error', err?.error?.message || 'Password Reset Failed', 'error');
      },
    });
  }

  sendToken() {
    this.currentStep = 'enter-token';
  }

  goToTokenStep() {
    this.currentStep = 'enter-token';
  }

  goBack() {
    this.currentStep = 'selection';
    this.formSubmitted = false;
    this.oldPassword = '';
    this.token = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  closeModal() {
    this.close.emit();
  }
}
