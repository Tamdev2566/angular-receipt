import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserMgtService {
  userListRowData: any[] = [];

  setRowData(row: any[]) {
    this.userListRowData = row;
  }

  // private userListRowData = new BehaviorSubject<any>(null);
  // user$ = this.userSource.asObservable();
  // setUser(data: any) {
  //   this.userSource.next(data);
  // }
}
