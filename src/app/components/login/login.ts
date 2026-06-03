import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordMgmt } from '../password-mgmt/password-mgmt';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private router: Router) {}

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

    console.log('Form Invalid Status:', form.invalid);

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      this.isSuccess = true;

      localStorage.setItem('angular_token', 'dummy_token_v1');
      localStorage.setItem('user', JSON.stringify({ name: this.username }));

      this.router.navigate(['/home']);
    }, 1500);
  }
}
