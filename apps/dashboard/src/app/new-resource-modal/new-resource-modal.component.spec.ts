import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEnvironmentModalComponent } from './new-environment-modal.component';

describe('NewEnvironmentModalComponent', () => {
  let component: NewEnvironmentModalComponent;
  let fixture: ComponentFixture<NewEnvironmentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewEnvironmentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewEnvironmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
