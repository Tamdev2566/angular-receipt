import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UserMgtService {
  userListRowData: any[] = [];

  constructor(private http: HttpClient) {}

  setRowData(row: any[]) {
    this.userListRowData = row;
  }

  getUserInfo(userId: string) {
    return this.http.get(`${environment.apiUrl}/?q=/UserManagements/userInfo/${userId}`);
  }
}
