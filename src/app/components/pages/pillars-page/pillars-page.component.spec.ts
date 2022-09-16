import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PillarsPageComponent } from './pillars-page.component';

describe('PillarsPageComponent', () => {
  let component: PillarsPageComponent;
  let fixture: ComponentFixture<PillarsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PillarsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PillarsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
