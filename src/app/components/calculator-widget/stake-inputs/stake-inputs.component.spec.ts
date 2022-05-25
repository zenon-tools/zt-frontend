import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeInputsComponent } from './stake-inputs.component';

describe('StakeInputsComponent', () => {
  let component: StakeInputsComponent;
  let fixture: ComponentFixture<StakeInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StakeInputsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
