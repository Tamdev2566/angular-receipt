import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndoReceipt } from './undo-receipt';

describe('UndoReceipt', () => {
  let component: UndoReceipt;
  let fixture: ComponentFixture<UndoReceipt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UndoReceipt],
    }).compileComponents();

    fixture = TestBed.createComponent(UndoReceipt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
