import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  visible: boolean = false;
  type: string = 'success';
  title: string = '';
  message: string = '';

  showAlert(title: string, message: string, type: string = 'success') {
    this.title = title;
    this.message = message;
    this.type = type;
    this.visible = true;
  }

  clearAlert() {
    this.visible = false;
  }
}
