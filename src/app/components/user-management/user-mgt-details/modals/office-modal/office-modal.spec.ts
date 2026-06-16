import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeModal } from './office-modal';

describe('OfficeModal', () => {
  let component: OfficeModal;
  let fixture: ComponentFixture<OfficeModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficeModal],
    }).compileComponents();

    fixture = TestBed.createComponent(OfficeModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
