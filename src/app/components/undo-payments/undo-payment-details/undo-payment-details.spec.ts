import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndoPaymentDetails } from './undo-payment-details';

describe('UndoPaymentDetails', () => {
  let component: UndoPaymentDetails;
  let fixture: ComponentFixture<UndoPaymentDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UndoPaymentDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(UndoPaymentDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
