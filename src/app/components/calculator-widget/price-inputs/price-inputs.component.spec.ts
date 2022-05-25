import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceInputsComponent } from './price-inputs.component';

describe('PriceInputsComponent', () => {
  let component: PriceInputsComponent;
  let fixture: ComponentFixture<PriceInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceInputsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
