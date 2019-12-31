import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import 'd3-transition';
import { BarChartData } from '../../shared/interfaces/interface';
import { BarChartService } from '../bar-chart/bar-chart.service';
import { Subscription } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService


@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit, OnDestroy {

  public data: BarChartData[] = [];
  public dataForChild: BarChartData[] = [];

  title = 'Bar Chart';

  private subscription: Subscription;
  xAxisGroup: any;
  yAxisGroup: any;
  inputText: string;
  inputValue: number;
  constructor(private chartService: BarChartService,
              private ngxLoader: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.ngxLoader.start();
    this.subscription = this.chartService.getBarChartData().subscribe((res: any) => {
      this.ngxLoader.stop();
      console.log(res);
      res.forEach(change => {
        const doc = { ...change.payload.doc.data(), id: change.payload.doc.id };
        this.checkTypeAndUpdateData(change, doc);
      });
      this.dataForChild = JSON.parse(JSON.stringify(this.data));
    });
  }

  private checkTypeAndUpdateData(change, doc) {
    switch (change.type) {

      case 'added':
        this.data.push(doc);
        break;

      case 'modified':
        const index = this.data.findIndex(item => item.id === doc.id);
        this.data[index] = doc;
        break;

      case 'removed':
        this.data = this.data.filter(item => item.id !== doc.id);
        break;

      default:
        break;
    }
  }

  onInputClick() {
    if (this.inputText && this.inputValue) {
      console.log(this.inputText);
      console.log(this.inputValue);
      this.chartService.addDataToBarChart({ Name: this.inputText, Orders: this.inputValue }).then(res => {
        console.log('Add', res);
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

