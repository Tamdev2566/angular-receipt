import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMgtDetails } from './group-mgt-details';

describe('GroupMgtDetails', () => {
  let component: GroupMgtDetails;
  let fixture: ComponentFixture<GroupMgtDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupMgtDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupMgtDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
