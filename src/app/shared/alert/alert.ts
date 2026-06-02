import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alertService/alert';

@Component({
  selector: 'app-alert-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrls: ['./alert.scss'],
})
export class AlertMessage {
  // 2. Fix the type here from AlertMessage to AlertService
  constructor(public alertService: AlertService) {}

  get visible() {
    return this.alertService.visible;
  }
  get type() {
    return this.alertService.type;
  }
  get title() {
    return this.alertService.title;
  }
  get message() {
    return this.alertService.message;
  }

  dismiss() {
    this.alertService.clearAlert();
  }
}
