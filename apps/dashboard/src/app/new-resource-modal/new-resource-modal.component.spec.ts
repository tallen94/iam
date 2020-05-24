import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewResourceModalComponent } from './new-resource-modal.component';

describe('NewEnvironmentModalComponent', () => {
  let component: NewResourceModalComponent;
  let fixture: ComponentFixture<NewResourceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewResourceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewResourceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
