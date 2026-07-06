import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndoReceipts } from './undo-receipts';

describe('UndoReceipts', () => {
  let component: UndoReceipts;
  let fixture: ComponentFixture<UndoReceipts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UndoReceipts],
    }).compileComponents();

    fixture = TestBed.createComponent(UndoReceipts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
