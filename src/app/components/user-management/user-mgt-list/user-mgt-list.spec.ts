import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMgtList } from './user-mgt-list';

describe('UserMgtList', () => {
  let component: UserMgtList;
  let fixture: ComponentFixture<UserMgtList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMgtList],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMgtList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
