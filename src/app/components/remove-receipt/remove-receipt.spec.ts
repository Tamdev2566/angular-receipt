import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveReceipt } from './remove-receipt';

describe('RemoveReceipt', () => {
  let component: RemoveReceipt;
  let fixture: ComponentFixture<RemoveReceipt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveReceipt],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveReceipt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
