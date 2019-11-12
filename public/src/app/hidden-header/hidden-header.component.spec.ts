import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenHeaderComponent } from './hidden-header.component';

describe('HiddenHeaderComponent', () => {
  let component: HiddenHeaderComponent;
  let fixture: ComponentFixture<HiddenHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HiddenHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiddenHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
