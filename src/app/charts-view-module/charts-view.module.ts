import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartViewComponent } from './components/bar-chart-view/bar-chart-view.component';
import { HeirachyChartViewComponent } from './components/heirachy-chart-view/heirachy-chart-view.component';
import { LineChartViewComponent } from './components/line-chart-view/line-chart-view.component';
import { PieChartViewComponent } from './components/pie-chart-view/pie-chart-view.component';



@NgModule({
  declarations: [
    BarChartViewComponent,
    HeirachyChartViewComponent,
    LineChartViewComponent,
    PieChartViewComponent

  ],
  imports: [
    CommonModule
  ],
  exports: [
    BarChartViewComponent,
    HeirachyChartViewComponent,
    LineChartViewComponent,
    PieChartViewComponent  ]
})
export class ChartsViewModule { }
