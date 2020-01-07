import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeirachyChartViewComponent } from './heirachy-chart-view.component';

describe('HeirachyChartViewComponent', () => {
  let component: HeirachyChartViewComponent;
  let fixture: ComponentFixture<HeirachyChartViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeirachyChartViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeirachyChartViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
