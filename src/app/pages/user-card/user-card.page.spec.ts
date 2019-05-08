import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCardPage } from './user-card.page';

describe('UserCardPage', () => {
  let component: UserCardPage;
  let fixture: ComponentFixture<UserCardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
