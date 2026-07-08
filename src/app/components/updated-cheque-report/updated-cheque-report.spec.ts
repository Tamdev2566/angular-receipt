import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedChequeReport } from './updated-cheque-report';

describe('UpdatedChequeReport', () => {
  let component: UpdatedChequeReport;
  let fixture: ComponentFixture<UpdatedChequeReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatedChequeReport],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatedChequeReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
