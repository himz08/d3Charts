import { Component, OnInit, OnDestroy } from '@angular/core';
import { DruidService } from './druid.service';
import { DruidData } from '../shared/interfaces/interface';
import { configForBarChart, configForLineChart, configForPieChart } from './druid.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-druid-data',
  templateUrl: './druid-data.component.html',
  styleUrls: ['./druid-data.component.scss']
})
export class DruidDataComponent implements OnInit, OnDestroy {

  constructor(private service: DruidService) { }
  private configForBarChart;
  private configForLineChart;
  private configForPieChart;

  data: DruidData[] = [];
  rawData: DruidData[] = [];
  sourceId = 1;
  chartId = 1;
  chartBoxHeight = 600;
  isBarChartDataReady: boolean;
  public instanceNamesAvl: string[] = [];
  public  selectedLineChartOption: string;
  public currentSubscription: Subscription;

  ngOnInit() {
    this.setConfig();
    this.onSourceChange(1);

    const pollingObservable = Observable.create((observer: any) => {
      setInterval(() => {
        observer.next();
      }, 10000);
    });

    this.currentSubscription = pollingObservable.subscribe(res => {
      this.onSourceChange(this.sourceId);
    })
  }

  setConfig() {
    this.configForBarChart = configForBarChart;
    this.configForLineChart = configForLineChart;
    this.configForPieChart = configForPieChart;
  }


  // Common

  onSourceChange(id: number) {
    this.sourceId = id;
    if (this.chartId === 1) { // Bar Chart
      this.chartBoxHeight = 600;
      if (id === 1) {
        this.service.getDruidData('allCPU').subscribe((res: any) => {
          res.forEach(el => {
            el.instance_name = el.event.instance_name;
            el.average = el.event.average;
          });
          console.log(res);
          this.data = res;
          this.isBarChartDataReady = true;
        });
      } else if (id === 2) {
        this.service.getDruidData('allMEM').subscribe((res: any) => {
        res.forEach(el => {
          el.instance_name = el.event.instance_name;
          el.average = el.event.average;
        });
        console.log(res);
        this.data = res;
      });
      }
    } else if (this.chartId === 4) { // Line Chart
      this.chartBoxHeight = 450;
      if (id === 1) {
        this.service.getDruidData('minCPU').subscribe((res: any) => {
          res.forEach(el => {
            el.instance_name = el.event.instance_name;
            el.average = el.event.average;
          });
          console.log('...', res);
          this.findInstanceNamesLineChart(res);
          this.rawData = res;
          this.data = res.filter(item => item.instance_name === this.selectedLineChartOption);
          // this.isBarChartDataReady = true;

        });
      } else if (id === 2) {
        this.service.getDruidData('minMEM').subscribe((res: any) => {
        res.forEach(el => {
          el.instance_name = el.event.instance_name;
          el.average = el.event.average;
        });
        this.findInstanceNamesLineChart(res);
        console.log('...', res);
        this.rawData = res;
        this.data = res.filter(item => item.instance_name === this.selectedLineChartOption);
      });
      }
    } else if (this.chartId === 2) { // Pie Chart
      this.chartBoxHeight = 450;
      if (id === 1) {
        this.service.getDruidData('minCPU').subscribe((res: any) => {
          this.createDataForPieChart(res);
          this.rawData = res;
        });
      } else if (id === 2) {
        this.service.getDruidData('minMEM').subscribe((res: any) => {
          this.createDataForPieChart(res);
          this.rawData = res;
      });
      }
    }

  }

  onChartChange(id: number) {
    this.data = null;
    this.chartId = id;
    this.onSourceChange(this.sourceId);
  }  // Bar Chart

  // Line Chart

  findInstanceNamesLineChart(res: DruidData[]) {
    const instanceNamesAvl = [];
    res.forEach(el => {
     const i = instanceNamesAvl.findIndex(item => item === el.event.instance_name);
     if (i === -1) {
       instanceNamesAvl.push(el.event.instance_name);
     }
    });
    this.instanceNamesAvl = instanceNamesAvl;
    this.selectedLineChartOption = instanceNamesAvl[0];
    console.log('::::::::::>>', instanceNamesAvl);
  }

  createDataForPieChart(res: DruidData[]) {
    const pieData: DruidData[] = [];
    res.forEach(el => {
     const i = pieData.findIndex(item => item.instance_name === el.event.instance_name);
     if (i === -1) {
      el.instance_name = el.event.instance_name;
      el.average = el.event.average;
      pieData.push(el);
     } else {
       pieData[i].average += el.event.average;
     }
  });
    this.data = pieData;
}

  onInstanceChange(name: string) {
    this.selectedLineChartOption = name;
    this.data = this.rawData.filter(item => item.instance_name === name);
  }

  ngOnDestroy() {
    this.currentSubscription.unsubscribe();
  }
}
