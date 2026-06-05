import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordMgmt } from '../password-mgmt/password-mgmt';
import { Router, RouterModule } from '@angular/router';
import { LoaderComponent } from '../../shared/loader/loader';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PasswordMgmt,LoaderComponent],
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
  
// onSubmit(form: any): void {
//   this.formSubmitted = true; 

//   console.log('Form Invalid Status:', form.invalid);

//   if (form.invalid) {
//     form.control.markAllAsTouched();
//     return;
//   }

//   this.isGlobalLoading = true;

//   setTimeout(() => {
//     this.isSuccess = true;

//     localStorage.setItem('angular_token', 'dummy_token_v1');
//     localStorage.setItem('user', JSON.stringify({ name: this.username }));
//     this.isGlobalLoading = false;
//     this.router.navigate(['/home']);
//   }, 5000);
// }

  onSubmit(form: any): void {
    this.formSubmitted = true;

    console.log('Form Invalid Status:', form.invalid);

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const systemUsers = JSON.parse(localStorage.getItem('system_users_db') || '[]');
    
    const matchedUser = systemUsers.find((user: any) => 
      user.userCode.toLowerCase() === this.username.toLowerCase() && 
      user.password === this.password
    );

    if (!matchedUser) {
      alert('Invalid User Code or Password credential entries! Access Denied.');
      return;
    }

    this.isGlobalLoading = true;

    setTimeout(() => {
      this.isSuccess = true;

      localStorage.setItem('angular_token', 'dummy_token_v1');
      localStorage.setItem('user', JSON.stringify({ 
        name: matchedUser.userName, 
        code: matchedUser.userCode,
        id: matchedUser.userId 
      }));
      
      this.isGlobalLoading = false;
      this.router.navigate(['/home']);
    }, 2000);
  }
}
