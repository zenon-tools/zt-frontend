import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceleratorPageComponent } from './accelerator-page.component';

describe('AcceleratorPageComponent', () => {
  let component: AcceleratorPageComponent;
  let fixture: ComponentFixture<AcceleratorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceleratorPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceleratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
