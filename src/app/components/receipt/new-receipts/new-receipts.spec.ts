import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewReceipts } from './new-receipts';

describe('NewReceipts', () => {
  let component: NewReceipts;
  let fixture: ComponentFixture<NewReceipts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewReceipts],
    }).compileComponents();

    fixture = TestBed.createComponent(NewReceipts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
