import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ChartService } from '../../shared/services/chart.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PiChartData } from 'src/app/shared/interfaces/interface';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit, OnDestroy {

  public data: PiChartData[] = [];
  public dataForChild: PiChartData[] = [];
  private subscription: Subscription;
  public isDataAvl: boolean;
  public inputForm: FormGroup;
  public erroMessage = 'Please enter the values';

  constructor(private chartService: ChartService,
              private ngxLoader: NgxUiLoaderService,
              private commonService: CommonService
  ) { }

  ngOnInit() {
    this.ngxLoader.start();
    this.subscription = this.chartService.getPieChartData().subscribe((res: any) => {
      this.ngxLoader.stop();
      console.log(res);
      this.data = [];
      res.forEach(change => {
        const doc = { ...change.payload.doc.data(), id: change.payload.doc.id };
        this.checkTypeAndUpdateData(change, doc);
      });
      this.dataForChild = JSON.parse(JSON.stringify(this.data));
      console.log('data for child', this.data);
    });
    this.initForm();
  }

private initForm() {
  this.inputForm = new FormGroup({
    itemName: new FormControl('', [Validators.required]),
    itemCost: new FormControl('', [Validators.required])
  });
}

  private checkTypeAndUpdateData(change, doc) {
    console.log('=============>>>>>', change.type);
    switch (change.type) {
      case 'added':
        console.log('added');
        this.data.push(doc);
        break;

      case 'modified':
        const index = this.data.findIndex(el => el.id === doc.id);
        this.data[index] = doc;
        break;

      case 'removed':
        console.log('data before removing element', this.data);
        this.data = this.data.filter(item => item.id !== doc.id);
        console.log('data after removing element', this.data);
        break;

      default:
        break;
    }
  }


onAddItemClick() {
  console.log(this.inputForm.controls.itemCost.valid, this.inputForm.controls.itemName.valid)
  if (this.inputForm.valid) {
    this.chartService.addPieChartData({
      name: this.inputForm.controls.itemName.value,
      cost: parseInt(this.inputForm.controls.itemCost.value),
    }).then(() => {
      this.commonService.openSnackBar('Added', 'ok');
      this.initForm();
    });
    // this.erroMessage = '';
  }
  else {
    // this.erroMessage = 'Please enter the values';
  }
}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

