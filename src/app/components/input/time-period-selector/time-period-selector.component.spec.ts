import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimePeriodSelectorComponent } from './time-period-selector.component';

describe('TimePeriodSelectorComponent', () => {
  let component: TimePeriodSelectorComponent;
  let fixture: ComponentFixture<TimePeriodSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimePeriodSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimePeriodSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
