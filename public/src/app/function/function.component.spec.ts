import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionComponent } from './function.component';

describe('FunctionComponent', () => {
  let component: FunctionComponent;
  let fixture: ComponentFixture<FunctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
