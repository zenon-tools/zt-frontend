import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprCardComponent } from './apr-card.component';

describe('AprCardComponent', () => {
  let component: AprCardComponent;
  let fixture: ComponentFixture<AprCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
