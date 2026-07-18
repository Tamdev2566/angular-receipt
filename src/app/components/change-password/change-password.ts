import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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

  @Input() isForced = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() passwordChanged = new EventEmitter<any>();

  private userId = '';

  constructor(
    private api: ApiService,
    private alert: AlertService,
    private router: Router,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    if (!this.isForced) {
      this.isForced = localStorage.getItem('passwordExpired') === 'true';
    }
    const user = this.userService.getUser();
    this.userId = user?.userId || user?.user_id || '';
  }

  get passwordStrengthOk(): boolean {
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

        localStorage.removeItem('passwordExpired');
        this.alert.showAlert('Success', 'Password changed successfully.', 'success');

        this.passwordChanged.emit(payload);
        this.closeModal.emit();
      },
      error: (err) => {
        this.loading = false;
        this.alert.showAlert('Error', err?.error?.message || 'Failed to change password.', 'error');
      },
    });
  }

  onSkip(): void {
    if (!this.isForced) {
      this.closeModal.emit();
    }
  }
}
