import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoItemTableComponent } from './info-item-table.component';

describe('InfoItemTableComponent', () => {
  let component: InfoItemTableComponent;
  let fixture: ComponentFixture<InfoItemTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoItemTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoItemTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
