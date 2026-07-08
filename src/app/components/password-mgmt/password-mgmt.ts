import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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

  private userId = '';

  constructor(
    private alertService: AlertService,
    private api: ApiService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    if (this.mode === 'change') this.currentStep = 'change-password';
    const user = this.userService.getUser();
    this.userId = user?.userId || user?.user_id || '';
  }

  onSubmitPassword(form: NgForm) {
    this.formSubmitted = true;

    if (form && form.invalid) {
      Object.keys(form.controls).forEach((key) => form.controls[key].markAsTouched());
      return;
    }

    const clmsRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!clmsRegex.test(this.newPassword)) {
      this.alertService.showAlert(
        'Error',
        'Password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character.',
        'error',
      );
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.alertService.showAlert('Error', 'Passwords do not match.', 'error');
      return;
    }

    if (!this.userId) {
      this.alertService.showAlert(
        'Error',
        'Unable to identify user. Please log in again.',
        'error',
      );
      return;
    }

    this.isLoading = true;

    const payload = {
      oldPassword: this.currentStep === 'change-password' ? this.oldPassword : '',
      newPassword: this.newPassword,
      username: this.userService.getUser()?.name || this.userId,
    };

    this.api.post(`UserManagements/users/${this.userId}/change-password`, payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.status === 400 || res?.status === 404) {
          this.alertService.showAlert('Error', res.message, 'error');
          return;
        }
        localStorage.removeItem('passwordExpired');
        const msg =
          this.currentStep === 'change-password'
            ? 'Password has been changed.'
            : 'Password has been reset.';
        this.alertService.showAlert('Success', msg, 'success');
        this.closeModal();
      },
      error: (err) => {
        this.isLoading = false;
        this.alertService.showAlert(
          'Error',
          err?.error?.message || 'Failed to update password.',
          'error',
        );
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
