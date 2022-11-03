import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenDetailsPageComponent } from './token-details-page.component';

describe('TokenDetailsPageComponent', () => {
  let component: TokenDetailsPageComponent;
  let fixture: ComponentFixture<TokenDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenDetailsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
