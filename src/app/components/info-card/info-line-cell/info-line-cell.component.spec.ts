import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoLineCellComponent } from './info-line-cell.component';

describe('InfoLineCellComponent', () => {
  let component: InfoLineCellComponent;
  let fixture: ComponentFixture<InfoLineCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoLineCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoLineCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
