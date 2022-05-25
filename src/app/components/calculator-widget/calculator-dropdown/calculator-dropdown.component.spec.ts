import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorDropdownComponent } from './calculator-dropdown.component';

describe('CalculatorDropdownComponent', () => {
  let component: CalculatorDropdownComponent;
  let fixture: ComponentFixture<CalculatorDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatorDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
