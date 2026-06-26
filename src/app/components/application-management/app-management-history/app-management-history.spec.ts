import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppManagementHistory } from './app-management-history';

describe('AppManagementHistory', () => {
  let component: AppManagementHistory;
  let fixture: ComponentFixture<AppManagementHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppManagementHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(AppManagementHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
