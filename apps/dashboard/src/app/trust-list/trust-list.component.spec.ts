import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustListComponent } from './trust-list.component';

describe('TrustListComponent', () => {
  let component: TrustListComponent;
  let fixture: ComponentFixture<TrustListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrustListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrustListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
