import { Component, OnInit } from '@angular/core';
import { DruidService } from './druid.service';
import { DruidData } from '../shared/interfaces/interface';

@Component({
  selector: 'app-druid-data',
  templateUrl: './druid-data.component.html',
  styleUrls: ['./druid-data.component.scss']
})
export class DruidDataComponent implements OnInit {

  constructor(private service: DruidService) { }
  configForBarChart = {
    scaleType: 'scaleBand',
    xPoints: null,
    yPoints: null,
    yUnitName: '%  ',
    xId: 'instance_name',
    yId: 'average',
    onClickEnable : false,
    hoverEnable : true,
    axisColor: '#ccc'
  };

  configForLineChart = {
    scaleType: 'scaleTime',
    xPoints: null,
    yPoints: null,
    yUnitName: 'Orders',
    xId: 'timestamp',
    yId: 'average',
    onClickEnable: false,
    hoverEnable: true,
    axisColor: '#ccc',
    dateTimeRepXaxis: '%c'
  };

  data: DruidData[] = [];
  rawData: DruidData[] = [];
  sourceId = 1;
  chartId = 1;
  isBarChartDataReady: boolean;
  public instanceNamesAvl: string[] = [];
  public  selectedLineChartOption: string;

  ngOnInit() {
    this.onSourceChange(1);
  }


  // Common

  onSourceChange(id: number) {
    this.sourceId = id;
    if (this.chartId === 1) {
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
    } else if (this.chartId === 4) {
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

  onInstanceChange(name: string) {
    this.selectedLineChartOption = name;
    this.data = this.rawData.filter(item => item.instance_name === name);
  }


}
