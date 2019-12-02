import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtcMedComponent } from './otc-med.component';

describe('OtcMedComponent', () => {
  let component: OtcMedComponent;
  let fixture: ComponentFixture<OtcMedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtcMedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtcMedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
