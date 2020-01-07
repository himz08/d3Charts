import { Component, OnInit } from '@angular/core';
import { ChartService } from '../../shared/services/chart.service';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { LineChartData } from '../../shared/interfaces/interface';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  servaerName: string;
  serverId = 1;
  distance = null;
  errorMessage = '';
  public data: LineChartData[] = [];
  public dataForChild: LineChartData[] = [];
  private subscription: Subscription;
  public inputForm: FormGroup;

  constructor(
    private chartService: ChartService,
    private ngxLoader: NgxUiLoaderService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.servaerName = 'Server One';
    this.ngxLoader.start();
    this.subscription = this.chartService.getLineChartData().subscribe((res: any) => {
      this.ngxLoader.stop();
      console.log(res);
      this.data = [];
      res.forEach(change => {
        const doc = { ...change.payload.doc.data(), id: change.payload.doc.id };
        // this.checkTypeAndUpdateData(change, doc);
        this.data.push(doc);
      });
      this.updateInputData();
    });
    this.chartService.emitPageId(1);
  }
  private updateInputData() {
    // this.dataForChild = JSON.parse(JSON.stringify(this.data)).filter(item => item.server === this.serverId);
    this.dataForChild = this.data.filter(item => item.server === this.serverId);
    console.log('data for child', this.data);
  }
  // private checkTypeAndUpdateData(change, doc) {
  //   switch (change.type) {
  //     case 'added':
  //       console.log('added');
  //       this.data.push(doc);
  //       break;

  //     case 'modified':
  //       console.log('Modified', doc.id);
  //       const index = this.data.findIndex(item => item.id === doc.id);

  //       console.log(index);
  //       this.data[index] = doc;
  //       break;

  //     case 'removed':
  //       console.log('data before removing element', this.data);
  //       this.data = this.data.filter(item => item.id !== doc.id);
  //       console.log('data after removing element', this.data);
  //       break;

  //     default:
  //       break;
  //   }
  // }

  onServerChange(id: number) {
    if (id === 1) {
      this.servaerName = 'Server One';
      this.serverId = 1;
    } else if (id === 2) {
      this.servaerName = 'Server Two';
      this.serverId = 2;
    } else if (id === 3) {
      this.servaerName = 'Server Three';
      this.serverId = 3;
    } else if (id === 4) {
      this.servaerName = 'Server Four';
      this.serverId = 4;
    }
    this.updateInputData();
  }

  onAddNew() {
    if (this.distance >= 0) {
      const data = {
        distance: parseInt(this.distance, 10),
        server: this.serverId,
        date: new Date().toString(),
      };
      this.chartService.addDataToLineChart(data).then(() => {
        this.distance = null;
      });
    } else {
      this.errorMessage = 'Please enter a valid distance';
    }
  }

}


// EMPTY ARRAY BUG PENDING
