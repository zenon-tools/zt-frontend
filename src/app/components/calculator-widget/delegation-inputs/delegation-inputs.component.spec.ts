import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegationInputsComponent } from './delegation-inputs.component';

describe('DelegationInputsComponent', () => {
  let component: DelegationInputsComponent;
  let fixture: ComponentFixture<DelegationInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegationInputsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegationInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
