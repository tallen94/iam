import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewExecutableComponent } from './new-executable.component';

describe('NewExecutableComponent', () => {
  let component: NewExecutableComponent;
  let fixture: ComponentFixture<NewExecutableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewExecutableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewExecutableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
