import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartViewComponent } from './bar-chart-view.component';

describe('BarChartViewComponent', () => {
  let component: BarChartViewComponent;
  let fixture: ComponentFixture<BarChartViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
