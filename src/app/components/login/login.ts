import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from '../../services/alertService/alert';
import { AuthService } from '../../services/authService/auth.service';
import { LoaderComponent } from '../../shared/loader/loader';
import { PasswordMgmt } from '../password-mgmt/password-mgmt';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PasswordMgmt, LoaderComponent],
})
export class LoginPage {
  username = '';
  password = '';
  showPassword = false;
  isLoading = false;
  isSuccess = false;
  showProfileDropdown = false;
  profile = 'Live';
  formSubmitted = false;
  showForgotModal: boolean = false;
  modalMode: 'forgot' | 'change' = 'forgot';

  isGlobalLoading: boolean = false;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    const sessionId = localStorage.getItem('sessionId');

    if (sessionId) {
      this.router.navigate(['/home']);
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  selectProfile(value: string): void {
    this.profile = value;
    this.showProfileDropdown = false;
  }

  openForgotModal(event: Event, modeType: 'forgot' | 'change') {
    event.preventDefault();
    this.modalMode = modeType;
    this.showForgotModal = true;
  }

  onSubmit(form: any): void {
    this.formSubmitted = true;

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isGlobalLoading = true;

    const payload = {
      email: this.username,
      password: this.password,
    };

    this.authService
      .login(payload)
      .pipe(
        finalize(() => {
          this.isGlobalLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          console.log('response', res);

          localStorage.setItem('angular_token', res.token);
          localStorage.setItem('token_expire', res.expire);

          this.alertService.showAlert('Logged In Successfully!', '', 'success');
          this.router.navigate(['/home']);
        },

        error: (err) => {
          console.log('ERROR:', err);

          this.alertService.showAlert(
            err?.error?.message || err?.error || 'Something went wrong, Please try again later',
            '',
            'error',
          );
        },
      });
  }
}
