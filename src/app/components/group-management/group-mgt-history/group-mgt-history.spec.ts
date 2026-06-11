import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMgtHistory } from './group-mgt-history';

describe('GroupMgtHistory', () => {
  let component: GroupMgtHistory;
  let fixture: ComponentFixture<GroupMgtHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupMgtHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupMgtHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
