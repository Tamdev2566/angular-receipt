import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMgtList } from './group-mgt-list';

describe('GroupMgtList', () => {
  let component: GroupMgtList;
  let fixture: ComponentFixture<GroupMgtList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupMgtList],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupMgtList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
