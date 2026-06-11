import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMgtHistory } from './user-mgt-history';

describe('UserMgtHistory', () => {
  let component: UserMgtHistory;
  let fixture: ComponentFixture<UserMgtHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMgtHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMgtHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
