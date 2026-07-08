import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovedInvoiceReport } from './removed-invoice-report';

describe('RemovedInvoiceReport', () => {
  let component: RemovedInvoiceReport;
  let fixture: ComponentFixture<RemovedInvoiceReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemovedInvoiceReport],
    }).compileComponents();

    fixture = TestBed.createComponent(RemovedInvoiceReport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
