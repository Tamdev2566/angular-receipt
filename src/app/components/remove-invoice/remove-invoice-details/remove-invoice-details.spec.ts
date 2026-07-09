import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveInvoiceDetails } from './remove-invoice-details';

describe('RemoveInvoiceDetails', () => {
  let component: RemoveInvoiceDetails;
  let fixture: ComponentFixture<RemoveInvoiceDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveInvoiceDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveInvoiceDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
