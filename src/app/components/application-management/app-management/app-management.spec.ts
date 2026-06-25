import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppManagement } from './app-management';

describe('AppManagement', () => {
  let component: AppManagement;
  let fixture: ComponentFixture<AppManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(AppManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
