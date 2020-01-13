import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import 'd3-transition';
import { BarChartData } from '../../shared/interfaces/interface';
import { ChartService } from '../../shared/services/chart.service';
import { Subscription } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common.service';

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
  i = 0;
  inputForm: FormGroup;
  constructor(private chartService: ChartService,
              private ngxLoader: NgxUiLoaderService,
              private commonService: CommonService
  ) { }

  ngOnInit() {
    this.initForm();
    this.ngxLoader.start();
    this.subscription = this.chartService.getBarChartData().subscribe((res: any) => {
      this.ngxLoader.stop();
      res.forEach(change => {
        const doc = { ...change.payload.doc.data(), id: change.payload.doc.id };
        this.checkTypeAndUpdateData(change, doc);
      });
      this.dataForChild = JSON.parse(JSON.stringify(this.data));
      // console.log('data for child', this.data);

    });
    this.chartService.emitPageId(2);
  }
  private initForm() {
    this.inputForm = new FormGroup({
      itemName: new FormControl('', [Validators.required]),
      itemCost: new FormControl('', [Validators.required])
    });
  }

  private checkTypeAndUpdateData(change, doc) {
    console.log('>>>>>>>' , this.i++ , change.type);
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

  onAddItemClick() {
    console.log(this.inputForm.controls.itemCost.valid, this.inputForm.controls.itemName.valid)
    if (this.inputForm.valid) {
      this.chartService.addBarChartData({
        Name: this.inputForm.controls.itemName.value,
        Orders: parseInt(this.inputForm.controls.itemCost.value),
      }).then(() => {
        this.commonService.openSnackBar('Added', 'ok');
        this.initForm();
      });

    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

