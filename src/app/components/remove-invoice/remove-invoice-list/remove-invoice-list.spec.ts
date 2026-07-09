import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveInvoiceList } from './remove-invoice-list';

describe('RemoveInvoiceList', () => {
  let component: RemoveInvoiceList;
  let fixture: ComponentFixture<RemoveInvoiceList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveInvoiceList],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveInvoiceList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
