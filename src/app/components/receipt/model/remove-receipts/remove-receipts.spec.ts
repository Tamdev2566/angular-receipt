import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveReceipts } from './remove-receipts';

describe('RemoveReceipts', () => {
  let component: RemoveReceipts;
  let fixture: ComponentFixture<RemoveReceipts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveReceipts],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveReceipts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
