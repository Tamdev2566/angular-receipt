import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AlertService } from '../../services/alertService/alert';

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

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    if (this.mode === 'change') this.currentStep = 'change-password';
  }

  onSubmitPassword(form: NgForm) {
    this.formSubmitted = true;

    console.log('=== [CLMS DEBUG START] ===');
    console.log('1. Click Triggered Successfully!');
    console.log('2. Current Step Mode:', this.currentStep);
    console.log('3. Angular NgForm Object:', form);

    if (form) {
      console.log('4. Form Valid State:', form.valid);
      console.log('5. Form HTML Controls Status:', form.controls);
    } else {
      console.log('4. ⚠️ NgForm object is UNDEFINED or NULL!');
    }

    console.log('6. Field Values ->', {
      token: this.token,
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
    });
    console.log('=== [CLMS DEBUG END] ===');

    if (form && form.invalid) {
      console.log('⛔ Stopping execution: Form validation failed internally.');
      Object.keys(form.controls).forEach((key) => {
        form.controls[key].markAsTouched();
      });
      return;
    }

    // if (this.newPassword !== this.confirmPassword) {
    //   this.alertService.showAlert('Error', 'Password is not match', 'error');
    //   return;
    // }

    const clmsRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    console.log(!clmsRegex.test(this.newPassword), 'regex');

    if (!clmsRegex.test(this.newPassword)) {
      this.alertService.showAlert(
        'Error',
        'Password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character.',
        'error',
      );
      return;
    }

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      if (this.currentStep === 'change-password') {
        this.alertService.showAlert('Sueccess', 'Password has been changed.', 'success');
      } else {
        this.alertService.showAlert('Sueccess', 'Password has been reset.', 'success');
      }
      this.closeModal();
    }, 2000);
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
