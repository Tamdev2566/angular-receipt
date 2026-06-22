import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivilegeModal } from './privilege-modal';

describe('PrivilegeModal', () => {
  let component: PrivilegeModal;
  let fixture: ComponentFixture<PrivilegeModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivilegeModal],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivilegeModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
