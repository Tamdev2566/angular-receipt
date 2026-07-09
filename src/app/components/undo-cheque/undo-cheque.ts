import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Combobox } from '../../shared/combobox/combobox';

@Component({
  selector: 'app-undo-cheque',
  standalone: true,
  imports: [CommonModule, FormsModule, Combobox],
  templateUrl: './undo-cheque.html',
  styleUrls: ['./undo-cheque.scss'],
})
export class UndoCheque {
  constructor(private router: Router) {}

  /* Retrieve */

  retrieve = {
    chequeNo: '',
    fullCheque: '',
  };

  /* Cheque Reader Details */

  chequeDetails = {
    bound: '',
    bankName: '',
    scanUserId: '',
  };

  /* Undo */

  undo = {
    remark: '',
  };

  loading = false;

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

  /* Retrieve */

  retrieveCheque(): void {
    console.log('Retrieve');

    console.log(this.retrieve);

    // Dummy Data

    this.chequeDetails = {
      bound: 'Inbound',
      bankName: 'DBS Bank',
      scanUserId: 'SSL001',
    };
  }

  /* Undo */

  undoCheque(): void {
    if (!this.undo.remark.trim()) {
      alert('Please enter Remark');
      return;
    }

    const payload = {
      chequeNo: this.retrieve.chequeNo,
      fullCheque: this.retrieve.fullCheque,
      bound: this.chequeDetails.bound,
      bankName: this.chequeDetails.bankName,
      scanUserId: this.chequeDetails.scanUserId,
      remark: this.undo.remark,
    };

    console.log(payload);

    // TODO
    // this.apiService.post(...)
  }

  /* Cancel */

  onCancel(): void {
    this.retrieve = { chequeNo: '', fullCheque: '' };
    this.chequeDetails = { bound: '', bankName: '', scanUserId: '' };
    this.undo = { remark: '' };
  }

  /* Combobox Change */

  onChequeChange(value: any, item: any): void {
    console.log('Cheque Changed');

    console.log(value);

    console.log(item);
  }

  onFullChequeChange(value: any, item: any): void {
    console.log('Full Cheque Changed');

    console.log(value);

    console.log(item);
  }
}
