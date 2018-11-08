import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeDisplayComponent } from './trade-display.component';

describe('TradeDisplayComponent', () => {
  let component: TradeDisplayComponent;
  let fixture: ComponentFixture<TradeDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
