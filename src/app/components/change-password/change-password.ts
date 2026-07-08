import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alertService/alert';
import { UserService } from '../../services/userService/user.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePasswordPage implements OnInit {
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  showOld = false;
  showNew = false;
  showConfirm = false;
  loading = false;
  submitted = false;

  /** true when redirected here because password expired — cannot skip */
  isForced = false;

  private userId = '';

  constructor(
    private api: ApiService,
    private alert: AlertService,
    private router: Router,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.isForced = localStorage.getItem('passwordExpired') === 'true';
    const user = this.userService.getUser();
    this.userId = user?.userId || user?.user_id || '';
  }

  get passwordStrengthOk(): boolean {
    // Min 8 chars, 1 upper, 1 lower, 1 digit, 1 special
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(this.newPassword);
  }

  onSubmit(form: NgForm): void {
    this.submitted = true;
    if (form.invalid) return;

    if (!this.passwordStrengthOk) {
      this.alert.showAlert(
        'Weak Password',
        'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.',
        'error',
      );
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.alert.showAlert('Error', 'New password and confirmation do not match.', 'error');
      return;
    }

    if (!this.userId) {
      this.alert.showAlert('Error', 'Unable to identify user. Please log in again.', 'error');
      return;
    }

    this.loading = true;

    const payload = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
      username: this.userService.getUser()?.name || this.userId,
    };

    this.api.post(`UserManagements/users/${this.userId}/change-password`, payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res?.status === 400 || res?.status === 404) {
          this.alert.showAlert('Error', res.message, 'error');
          return;
        }
        // Clear expiry flag and redirect
        localStorage.removeItem('passwordExpired');
        this.alert.showAlert('Success', 'Password changed successfully.', 'success');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        this.alert.showAlert('Error', err?.error?.message || 'Failed to change password.', 'error');
      },
    });
  }

  onSkip(): void {
    // Only allowed if not a forced expiry redirect
    if (!this.isForced) {
      this.router.navigate(['/home']);
    }
  }
}
