import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PillarInputsComponent } from './pillar-inputs.component';

describe('PillarInputsComponent', () => {
  let component: PillarInputsComponent;
  let fixture: ComponentFixture<PillarInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PillarInputsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PillarInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
