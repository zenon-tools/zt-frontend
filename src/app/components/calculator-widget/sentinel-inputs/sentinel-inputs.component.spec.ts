import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentinelInputsComponent } from './sentinel-inputs.component';

describe('SentinelInputsComponent', () => {
  let component: SentinelInputsComponent;
  let fixture: ComponentFixture<SentinelInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SentinelInputsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SentinelInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
