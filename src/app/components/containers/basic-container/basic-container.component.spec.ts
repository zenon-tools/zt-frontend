import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicContainerComponent } from './basic-container.component';

describe('BasicCardComponent', () => {
  let component: BasicContainerComponent;
  let fixture: ComponentFixture<BasicContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
