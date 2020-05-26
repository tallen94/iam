import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTokenModalComponent } from './user-token-modal.component';

describe('UserTokenModalComponent', () => {
  let component: UserTokenModalComponent;
  let fixture: ComponentFixture<UserTokenModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTokenModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTokenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
