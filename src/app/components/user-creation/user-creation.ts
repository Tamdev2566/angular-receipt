import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../services/alertService/alert';

@Component({
  selector: 'app-user-landing',
  templateUrl: './user-creation.html',
  // styleUrls: ['./receipt/receipts.scss', './user-creation.scss'],
  styleUrls: ['./user-creation.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UserCreation implements OnInit {
  usersList: any[] = [];
  isModalOpen = false;
  formSubmitted = false;
  isSaving = false;
  passwordMismatch = false;

  regData = { userId: '', userCode: '', userName: '', password: '', confirmPassword: '' };

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.loadUsersFromDatabase();

    console.log('userData',localStorage.getItem('system_users_db'));
    
  }

  loadUsersFromDatabase(): void {
    this.usersList = JSON.parse(localStorage.getItem('system_users_db') || '[]');
  }

  openCreateUserModal(): void {
    this.regData = { userId: '', userCode: '', userName: '', password: '', confirmPassword: '' };
    this.formSubmitted = false;
    this.passwordMismatch = false;
    this.isModalOpen = true;
  }

  closeCreateUserModal(): void {
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
    
    const userExists = currentUsers.some((u: any) => u.userCode.toLowerCase() === this.regData.userCode.toLowerCase());
    if (userExists) {
      alert('User Code already exists!');
      this.isSaving = false;
      return;
    }

    currentUsers.push({
      userId: this.regData.userId,
      userCode: this.regData.userCode,
      userName: this.regData.userName,
      password: this.regData.password
    });

    localStorage.setItem('system_users_db', JSON.stringify(currentUsers));
    this.loadUsersFromDatabase(); 
    
    this.alertService.showAlert(
        'Success',
        'User Created Successfully!',
        'success',
      );
    this.isSaving = false;
    this.isModalOpen = false; 
  }, 1200);
}

  deleteUserAccount(targetUser: any): void {
    if (confirm(`Are you sure you want to completely erase ${targetUser.userName}?`)) {
      let currentUsers = JSON.parse(localStorage.getItem('system_users_db') || '[]');
      currentUsers = currentUsers.filter((u: any) => u.userCode !== targetUser.userCode);
      localStorage.setItem('system_users_db', JSON.stringify(currentUsers));
      this.loadUsersFromDatabase();
    }
  }
}