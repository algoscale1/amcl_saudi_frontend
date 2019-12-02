import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdheranceComponent } from './adherance.component';

describe('AdheranceComponent', () => {
  let component: AdheranceComponent;
  let fixture: ComponentFixture<AdheranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdheranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdheranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
