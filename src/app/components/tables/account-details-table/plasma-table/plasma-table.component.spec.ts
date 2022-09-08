import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlasmaTableComponent } from './plasma-table.component';

describe('PlasmaTableComponent', () => {
  let component: PlasmaTableComponent;
  let fixture: ComponentFixture<PlasmaTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlasmaTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlasmaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
