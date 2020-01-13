// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModuleBundle } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { environment } from "../environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';




// Components

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LineChartComponent } from './home/line-chart/line-chart.component';
import { BarChartComponent } from './home/bar-chart/bar-chart.component';
import { AreaChartComponent } from './home/area-chart/area-chart.component';
import { HierarchyChartComponent } from './home/hierarchy-chart/hierarchy-chart.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { PieChartComponent } from './home/pie-chart/pie-chart.component';
import { ConfirmationDialogComponent } from './shared/components/confirmation-dialog/confirmation-dialog.component';
import { DialogBoxComponent } from '../app/home/hierarchy-chart/dialog-box/dialog-box.component'
import { DruidDataComponent } from './druid-data/druid-data.component';
import { ChartsViewModule } from './charts-view-module/charts-view.module';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LineChartComponent,
    BarChartComponent,
    AreaChartComponent,
    HierarchyChartComponent,
    LoaderComponent,
    PieChartComponent,
    ConfirmationDialogComponent,
    DialogBoxComponent,
    DruidDataComponent,

  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    MaterialModuleBundle,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatIconModule,
    MatSidenavModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    NgxUiLoaderModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ChartsViewModule
  ],
  providers: [],
  entryComponents: [ConfirmationDialogComponent, DialogBoxComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
