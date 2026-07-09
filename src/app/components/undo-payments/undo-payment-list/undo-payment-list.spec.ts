import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndoPaymentList } from './undo-payment-list';

describe('UndoPaymentList', () => {
  let component: UndoPaymentList;
  let fixture: ComponentFixture<UndoPaymentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UndoPaymentList],
    }).compileComponents();

    fixture = TestBed.createComponent(UndoPaymentList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
