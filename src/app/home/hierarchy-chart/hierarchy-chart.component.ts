import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogBoxComponent, DialogData } from './dialog-box/dialog-box.component';
import { ChartService } from 'src/app/shared/services/chart.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Subscription } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { HChartData } from 'src/app/shared/interfaces/interface';

@Component({
  selector: 'app-hierarchy-chart',
  templateUrl: './hierarchy-chart.component.html',
  styleUrls: ['./hierarchy-chart.component.scss']
})
export class HierarchyChartComponent implements OnInit {

  subscription: Subscription;
  public data: HChartData[] = [];
  public dataForChild: HChartData[] = [];

  constructor(
    public dialog: MatDialog,
    private chartService: ChartService,
    private commonService: CommonService,
    private ngxLoader: NgxUiLoaderService,

    ) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '350px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.chartService.addHChartData(result).then(res => {
          console.log('Done', res);
          this.commonService.openSnackBar('Added', 'ok');
        });
      }

    });
  }

  private updateInputData() {
    // this.dataForChild = JSON.parse(JSON.stringify(this.data)).filter(item => item.server === this.serverId);
    this.dataForChild = this.data;
    console.log('data for child', this.data);
  }

  ngOnInit() {
    this.ngxLoader.start();
    this.subscription = this.chartService.getHChartData().subscribe((res: any) => {
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
    this.chartService.emitPageId(4);

  }

}
