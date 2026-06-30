import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { AlertService } from '../../services/alertService/alert';
import { AuthService } from '../../services/authService/auth.service';
import { UserService } from '../../services/userService/user.service';
import { PasswordMgmt } from '../password-mgmt/password-mgmt';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PasswordMgmt],
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

  constructor(
    private router: Router,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private userService: UserService,
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

  getUserInitials(name: string): string {
    if (!name) return '';

    return name
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
  }

  onSubmit(form: any): void {
    this.formSubmitted = true;

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const payload = {
      email: this.username,
      password: this.password,
    };

    this.authService
      .login(payload)
      .pipe(
        finalize(() => {
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('angular_token', res.token);
          localStorage.setItem('token_expire', res.expire);

          this.authService.getUserInfo().subscribe({
            next: (userInfo: any) => {
              const locationName = userInfo.location?.split('|')[0] || '';

              const userData = {
                userInitial: this.getUserInitials(userInfo?.name),
                userLocation: locationName,
                ...userInfo,
              };

              this.userService.setUser(userData);

              let defaultLocation: any = null;

              if (userInfo.masterLocations?.length) {
                defaultLocation = userInfo.masterLocations.find((x: any) => x.default === 'Y');

                if (defaultLocation) {
                  localStorage.setItem('defaultLocation', JSON.stringify(defaultLocation));
                }

                localStorage.setItem('locationList', JSON.stringify(userInfo.masterLocations));
              }

              if (defaultLocation) {
                this.authService.getMenus(userInfo.masterLocations[0].usersLocationId).subscribe({
                  next: (menus: any) => {
                    localStorage.setItem('menus', JSON.stringify(menus));
                    console.log(menus);

                    this.alertService.showAlert('Success', 'Logged In Successfully!', 'success');

                    this.router.navigate(['/home']);
                  },
                  error: (err: any) => {
                    console.error('Menu API Error', err);

                    this.alertService.showAlert('Error', 'Unable to load menus', 'error');
                  },
                });
              } else {
                this.alertService.showAlert('Success', 'Logged In Successfully!', 'success');

                this.router.navigate(['/home']);
              }
            },
          });
        },

        error: (err) => {
          console.log('ERROR', err);
          this.alertService.showAlert('Error', err?.error, 'error');
        },
      });
  }
}
