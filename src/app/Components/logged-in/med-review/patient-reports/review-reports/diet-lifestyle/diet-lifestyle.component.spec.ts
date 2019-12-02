import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DietLifestyleComponent } from './diet-lifestyle.component';

describe('DietLifestyleComponent', () => {
  let component: DietLifestyleComponent;
  let fixture: ComponentFixture<DietLifestyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DietLifestyleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DietLifestyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
