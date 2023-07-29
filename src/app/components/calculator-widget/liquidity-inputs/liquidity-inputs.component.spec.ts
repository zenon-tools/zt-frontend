import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidityInputsComponent } from './liquidity-inputs.component';

describe('LiquidityInputsComponent', () => {
  let component: LiquidityInputsComponent;
  let fixture: ComponentFixture<LiquidityInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiquidityInputsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidityInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
