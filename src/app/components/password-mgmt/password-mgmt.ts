import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AlertService } from '../../services/alertService/alert';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/authService/auth.service';
import { UserService } from '../../services/userService/user.service';

type Step = 'enter-email' | 'enter-token' | 'change-password';

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

  currentStep: Step = 'enter-email';

  // Fields
  email = '';
  oldPassword = '';
  token = '';
  newPassword = '';
  confirmPassword = '';

  // Password Visibility Toggles
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  isLoading = false;
  formSubmitted = false;
  isPasswordPolicyInvalid = false;

  private userId = '';

  constructor(
    private alertService: AlertService,
    private auth: AuthService,
    private api: ApiService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    if (this.mode === 'change') {
      this.currentStep = 'change-password';
      const user = this.userService.getUser();
      this.userId = user?.userId || user?.user_id || '';
      this.email = user?.email || '';
    }
  }

  onSendToken(form: NgForm) {
    this.formSubmitted = true;
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.auth.forgotPassword(this.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.formSubmitted = false;
        this.currentStep = 'enter-token';
        this.alertService.showAlert(
          'Token Sent',
          'A 6-digit token has been sent to your email. It expires in 15 minutes.',
          'success',
        );
      },
      error: (err) => {
        this.isLoading = false;
        this.alertService.showAlert(
          'Error',
          err?.error?.message || 'Failed to send token.',
          'error',
        );
      },
    });
  }

  onSubmitPassword(form: NgForm) {
    this.formSubmitted = true;
    this.isPasswordPolicyInvalid = false;

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!pwdRegex.test(this.newPassword)) {
      this.isPasswordPolicyInvalid = true;
      // this.alertService.showAlert(
      //   'Error',
      //   'Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character.',
      //   'error',
      // );
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.alertService.showAlert('Error', 'Passwords do not match.', 'error');
      return;
    }

    this.isLoading = true;

    if (this.currentStep === 'change-password') {
      if (!this.userId) {
        this.alertService.showAlert(
          'Error',
          'Unable to identify user. Please log in again.',
          'error',
        );
        this.isLoading = false;
        return;
      }
      const payload = {
        oldPassword: this.oldPassword,
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
          this.alertService.showAlert('Success', 'Password has been changed.', 'success');
          this.closeModal();
        },
        error: (err: any) => {
          this.isLoading = false;
          this.alertService.showAlert(
            'Error',
            err?.error?.message || 'Failed to update password.',
            'error',
          );
        },
      });
    } else {
      this.auth.resetPassword(this.email, this.token, this.newPassword).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res?.status !== 200) {
            this.alertService.showAlert('Error', res?.message || 'Reset failed.', 'error');
            return;
          }
          this.alertService.showAlert(
            'Success',
            'Password reset successfully. You can now log in.',
            'success',
          );
          this.closeModal();
        },
        error: (err: any) => {
          this.isLoading = false;
          this.alertService.showAlert(
            'Error',
            err?.error?.message || 'Failed to reset password.',
            'error',
          );
        },
      });
    }
  }

  goToTokenStep() {
    this.currentStep = 'enter-token';
    this.formSubmitted = false;
    this.isPasswordPolicyInvalid = false;
    this.resetVisibility();
  }

  goBack() {
    this.currentStep = this.mode === 'forgot' ? 'enter-email' : 'change-password';
    this.formSubmitted = false;
    this.isPasswordPolicyInvalid = false;
    this.token = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.resetVisibility();
  }

  closeModal() {
    this.close.emit();
    this.resetVisibility();
  }

  private resetVisibility() {
    this.showOldPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }
}
