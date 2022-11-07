import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenDetailsTableComponent } from './token-details-table.component';

describe('TokenDetailsTableComponent', () => {
  let component: TokenDetailsTableComponent;
  let fixture: ComponentFixture<TokenDetailsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenDetailsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenDetailsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
