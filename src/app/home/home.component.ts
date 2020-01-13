import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { Route, Router } from '@angular/router';
import { ChartService } from '../shared/services/chart.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;
  pageId: number;

  private _mobileQueryListener: () => void;
  constructor(
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
    private chartService: ChartService,
    private route: Router,
    private cdr: ChangeDetectorRef,
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this._mobileQueryListener);
   }

  ngOnInit() {
    this.pageId = 1;
    this.chartService.activePageId.subscribe(res => {
      this.pageId = res;
      this.cdr.detectChanges();
    });
  }

  navigate(id: number) {

    this.pageId = id;
    if (id === 1) {
      this.route.navigate(['home/lineChart']);

    } else if (id === 2) {
      this.route.navigate(['home/barChart']);

    } else if (id === 3) {
      this.route.navigate(['home/pieChart']);

    } else if (id === 4) {
      this.route.navigate(['home/hChart']);

    } else if (id === 5) {
      this.route.navigate(['home/druid']);
    } else {
      this.route.navigate(['/home']);
    }
  }

  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
