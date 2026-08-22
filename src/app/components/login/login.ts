import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { AlertService } from '../../services/alertService/alert';
import { AuthService } from '../../services/authService/auth.service';
import { UserService } from '../../services/userService/user.service';
import { ModuleService } from '../../services/module-service/module-service'; // Import ModuleService
import { PasswordMgmt } from '../password-mgmt/password-mgmt';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PasswordMgmt],
})
export class LoginPage {
  private readonly destroyRef = inject(DestroyRef);
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
    private moduleService: ModuleService,
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('receipt_token');
    if (token) {
      this.router.navigate(['/main']);
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

    const payload = { email: this.username, password: this.password };

    this.authService
      .login(payload)
      .pipe(finalize(() => this.cdr.detectChanges()))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('receipt_token', res.token);
          localStorage.setItem('receipt_token_expire', res.expire);

          this.authService
            .getUserInfo()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (userInfo: any) => {
                const locationName = userInfo.location?.split('|')[0] || '';

                const userData = {
                  userInitial: this.getUserInitials(userInfo?.name),
                  userLocation: locationName,
                  ...userInfo,
                };

                this.userService.setUser(userData);

                if (userInfo.masterLocations?.length) {
                  const defaultLocation = userInfo.masterLocations.find(
                    (x: any) => x.default === 'Y',
                  );

                  if (defaultLocation) {
                    localStorage.setItem('defaultLocation', JSON.stringify(defaultLocation));
                  }

                  localStorage.setItem('locationList', JSON.stringify(userInfo.masterLocations));
                }

                this.alertService.showAlert('Success', 'Logged In Successfully!', 'success');

                // --- FETCH MENU DATA AND SET TO MODULE SERVICE ---
                if (userInfo?.masterLocations[0]?.groups.length) {
                  this.authService
                    .getAppMenus(userInfo.masterLocations[0]?.usersLocationId)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                      next: (menuApiData: any) => {
                        this.moduleService.setMenuItemsFromApi(menuApiData);
                      },
                      error: (err) => {
                        console.error('Failed to load dynamic menus', err);
                      },
                    });
                }

                const userId = userInfo.userId || userInfo.user_id;
                if (userId) {
                  this.authService
                    .checkPasswordStatus(userId)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                      next: (status: any) => {
                        if (status?.expired) {
                          localStorage.setItem('passwordExpired', 'true');
                          this.router.navigate(['/change-password']);
                        } else {
                          localStorage.removeItem('passwordExpired');
                          this.router.navigate(['main/welcome']);
                        }
                      },
                      error: () => {
                        this.router.navigate(['main/welcome']);
                      },
                    });
                } else {
                  this.router.navigate(['main/welcome']);
                }
              },

              error: (err) => {
                this.alertService.showAlert(
                  'Error',
                  err?.error?.message || 'Unable to fetch user information',
                  'error',
                );
              },
            });
        },

        error: (err) => {
          this.alertService.showAlert('Error', err?.error?.message, 'error');
        },
      });
  }
}
