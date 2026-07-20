import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/userService/user.service';
import { Combobox } from '../../shared/combobox/combobox';
import { ChequeService } from './service/undo-cheque-service';

@Component({
  selector: 'app-undo-cheque',
  standalone: true,
  imports: [CommonModule, FormsModule, Combobox],
  templateUrl: './undo-cheque.html',
  styleUrls: ['./undo-cheque.scss'],
})
export class UndoCheque {
  constructor(
    private user: UserService,
    private chequeService: ChequeService,
  ) {}

  /* Retrieve */

  retrieve = {
    chequeNo: '',
    fullCheque: '',
  };

  /* Cheque Reader Details */

  chequeDetails = {
    bound: '',
    bank_name: '',
    scan_user_id: '',
  };

  /* Undo */

  undo = {
    remark: '',
  };

  loading = false;
  fullchequeBody = { chequeNo: '' };

  /* Dummy Combobox Data
      (Replace with API later) */

  chequeList = [
    {
      cheque_id: 1,
      cheque_no: 'CHQ000001',
    },
    {
      cheque_id: 2,
      cheque_no: 'CHQ000002',
    },
    {
      cheque_id: 3,
      cheque_no: 'CHQ000003',
    },
  ];

  fullChequeList = [
    {
      full_cheque_id: 1,
      full_cheque_no: 'CHQ000001-000010',
    },
    {
      full_cheque_id: 2,
      full_cheque_no: 'CHQ000011-000020',
    },
  ];

  retrieveCheque(): void {
    this.chequeService
      .searchCheque(this.retrieve.chequeNo, this.retrieve.fullCheque)
      .subscribe((res) => {
        console.log(res);
        this.chequeDetails = res;
      });
  }

  undoCheque(): void {
    if (!this.undo.remark.trim()) {
      alert('Please enter Remark');
      return;
    }

    const payload = {
      chequeNo: this.retrieve.chequeNo,
      fullChequeNo: this.retrieve.fullCheque,
      remark: this.undo.remark,
      userId: this.user.getUser().name,
    };

    this.chequeService.undoCheque(payload).subscribe((res) => {
      console.log(res);
    });
  }

  onCancel(): void {
    this.retrieve = { chequeNo: '', fullCheque: '' };
    this.chequeDetails = { bound: '', bank_name: '', scan_user_id: '' };
    this.undo = { remark: '' };
  }

  onChequeChange(value: any, item: any): void {
    this.fullchequeBody.chequeNo = item?.name ?? '';
    this.retrieve.chequeNo = item?.name;
  }
  onFullChequeChange(value: any, item: any): void {
    this.retrieve.fullCheque = item?.name ?? '';
  }
}
