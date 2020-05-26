import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrustModalComponent } from './add-trust-modal.component';

describe('AddTrustModalComponent', () => {
  let component: AddTrustModalComponent;
  let fixture: ComponentFixture<AddTrustModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTrustModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTrustModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
