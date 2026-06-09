import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../services/alertService/alert';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-user-landing',
  templateUrl: './user-creation.html',
  styleUrls: ['./user-creation.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectComponent],
})
export class UserCreation implements OnInit {
  usersList: any[] = [];
  isModalOpen = false;
  formSubmitted = false;
  isSaving = false;
  passwordMismatch = false;
  showPassword = false;
  showConfirmPassword = false;

  regData = {
    userId: '',
    userCode: '',
    userName: '',
    role: 'User',
    password: '',
    confirmPassword: '',
  };
  constructor(
    private alertService: AlertService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadUsersFromDatabase();

    console.log('User Data', localStorage.getItem('system_users_db'));
  }

  loadUsersFromDatabase(): void {
    this.usersList = JSON.parse(localStorage.getItem('system_users_db') || '[]');
  }

  openCreateUserModal(): void {
    this.regData = {
      userId: '',
      userCode: '',
      userName: '',
      role: 'User',
      password: '',
      confirmPassword: '',
    };
    this.formSubmitted = false;
    this.passwordMismatch = false;
    this.isModalOpen = true;
  }

  closeCreateUserModal(): void {
    if (this.regData.userCode || this.regData.userName || this.regData.password) {
      const confirmClose = confirm(
        'You have unsaved changes. Are you sure you want to discard them?',
      );
      if (!confirmClose) {
        return;
      }
    }
    this.isModalOpen = false;
  }

  onRegister(form: any): void {
    this.formSubmitted = true;
    this.passwordMismatch = this.regData.password !== this.regData.confirmPassword;

    if (form.invalid || this.passwordMismatch) {
      form.control.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    setTimeout(() => {
      const currentUsers = JSON.parse(localStorage.getItem('system_users_db') || '[]');

      const userExists = currentUsers.some(
        (u: any) => u.userCode.toLowerCase() === this.regData.userCode.toLowerCase(),
      );
      if (userExists) {
        this.alertService.showAlert('Validation Error', 'User Code already exists!', 'error');
        this.isSaving = false;
        this.cdr.detectChanges();
        return;
      }

      currentUsers.push({
        userId: this.regData.userId,
        userCode: this.regData.userCode,
        userName: this.regData.userName,
        role: this.regData.role,
        password: this.regData.password,
      });

      localStorage.setItem('system_users_db', JSON.stringify(currentUsers));
      this.loadUsersFromDatabase();

      this.alertService.showAlert('Success', 'User Created Successfully!', 'success');
      this.isSaving = false;
      this.isModalOpen = false;

      this.cdr.detectChanges();
    }, 500);
  }

  deleteUserAccount(targetUser: any): void {
    if (confirm(`Are you sure you want to completely erase ${targetUser.userName}?`)) {
      let currentUsers = JSON.parse(localStorage.getItem('system_users_db') || '[]');
      currentUsers = currentUsers.filter((u: any) => u.userCode !== targetUser.userCode);
      localStorage.setItem('system_users_db', JSON.stringify(currentUsers));
      this.loadUsersFromDatabase();
      this.alertService.showAlert('Deleted', 'User profile erased successfully.', 'warning');
    }
  }
}
