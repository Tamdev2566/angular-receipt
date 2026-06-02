import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordMgmt } from './password-mgmt';

describe('PasswordMgmt', () => {
  let component: PasswordMgmt;
  let fixture: ComponentFixture<PasswordMgmt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordMgmt],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordMgmt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
