import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMgtDetails } from './user-mgt-details';

describe('UserMgtDetails', () => {
  let component: UserMgtDetails;
  let fixture: ComponentFixture<UserMgtDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMgtDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMgtDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
