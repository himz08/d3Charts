import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LineChartComponent } from './home/line-chart/line-chart.component';
import { BarChartComponent } from './home/bar-chart/bar-chart.component';
import { AreaChartComponent } from './home/area-chart/area-chart.component';
import { HierarchyChartComponent } from './home/hierarchy-chart/hierarchy-chart.component';
import { PieChartComponent } from './home/pie-chart/pie-chart.component';






const appRoutes: Routes = [
    { path : 'home', component : HomeComponent, children : [
        {path : 'lineChart' , component : LineChartComponent},
        {path : 'barChart' , component : BarChartComponent},
        {path : 'areaChart' , component : AreaChartComponent},
        {path : 'hChart', component : HierarchyChartComponent},
        {path : 'pieChart', component : PieChartComponent}
    ]},
    { path : '' , redirectTo : 'home/lineChart', pathMatch : 'full'}
];

@NgModule({
    imports : [RouterModule.forRoot(appRoutes)],
    exports : [RouterModule]
})
export class AppRoutingModule {



}
