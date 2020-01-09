import { Component, OnInit, SimpleChanges, Input, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartService } from '../../../shared/services/chart.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService

// D3 dependencies
import * as d3 from 'd3-selection';
import * as d3Shape from 'd3-shape';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';
import * as d3Array from 'd3-array';
import { BarChartData } from 'src/app/shared/interfaces/interface';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-bar-chart-view',
  templateUrl: './bar-chart-view.component.html',
  styleUrls: ['./bar-chart-view.component.scss']
})
export class BarChartViewComponent implements OnInit, OnChanges {

  private margin = {
    top: 20,
    right: 20,
    bottom: 100,
    left: 100
  };

  @Input() config: {
    scaleType: string;  // Value based linear or time stamp
    xPoints: number; // no of x-axis points required - Send null for the default.
    yPoints: number; // no of y axis ticks, send null for default
    yUnitName: string; // If you want to add something
    xId: string; // xLabel
    yId: string; // yLabel
    onClickEnable: boolean
    hoverEnable: boolean

  } = {
      scaleType: 'scaleBand',
      xPoints: null,
      yPoints: null,
      yUnitName: 'Orders',
      xId: 'Name',
      yId: 'Orders',
      onClickEnable: true,
      hoverEnable: false

    };

  @Input() data: any[] = [];
  private subscription: Subscription;
  private graphWidth: number;
  private graphHeight: number;
  private width = 600;
  private height = 600;
  private x: any;
  private y: any;
  private isInputDataAvailable: boolean;
  private svg: any;
  private line: d3Shape.Line<[number, number]>;
  xAxisGroup: any;
  yAxisGroup: any;

  constructor(private chartService: ChartService,
              private ngxLoader: NgxUiLoaderService,
              public dialog: MatDialog
  ) {
    this.graphWidth = this.width - this.margin.left - this.margin.right;
    this.graphHeight = this.height - this.margin.top - this.margin.bottom;

  }
  ngOnInit() {
    this.initSvg(); // Select elements and append group
    this.setScales(); // Scaling function of x and y axis
    this.createAxis(); // create x-axis and y-axis
    this.isInputDataAvailable = true;
    // if (this.data.length > 0) {
    console.log(this.data);
    this.update(this.data);
    // }
  }

  private initSvg() {
    this.svg = d3.select('svg')
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private setScales() {
    // scale manipulation
    // this.config.scaleType = 'scaleBand';
    if (this.config.scaleType === 'scaleTime') {
      this.x = d3Scale.scaleTime()
        .range([0, this.graphWidth]);
    } else if (this.config.scaleType === 'scaleLinear') {

    } else if (this.config.scaleType === 'scaleBand') {
      this.x = d3Scale.scaleBand()
        .range([0, this.graphWidth])
        .paddingInner(0.2)
        .paddingOuter(0.2);
    }
    this.y = d3Scale.scaleLinear()
      .range([this.graphHeight, 0]);


  }

  private createAxis() {
    // Create Axis group
    this.xAxisGroup = this.svg.append('g')
      .attr('transform', `translate(0,${this.graphHeight})`);
    this.yAxisGroup = this.svg.append('g');
  }

  private update(data) {
    // Update scales
    this.x.domain(data.map(d => d[this.config.xId]));
    let startValue = (d3Array.min(data, (d: any) => d[this.config.yId]) as any) - 1;
    if (startValue < 0) {
      startValue = 0;
    }
    const endValue = d3Array.max(data, (d: any) => d[this.config.yId]);
    this.y.domain([startValue, endValue]);

    console.warn(d3Array.max(data, (d: any) => d[this.config.yId]));

    // join data
    const rects = this.svg.selectAll('rect')
      .data(data);


    // remove unwanted
    rects.exit().remove();

    // aattr

    rects.attr('x', (d) => this.x(d[this.config.xId]))
      .attr('fill', (d) => {
        // return d.fill
        // return '#357392';
        return '#00bfa5';
      })
      .attr('width', this.x.bandwidth())
      .transition().duration(500)
      .attr('height', d => this.graphHeight - this.y(d[this.config.yId]))
      .attr('y', (d) => this.y(d[this.config.yId]));


    rects.enter()
      .append('rect')
      .attr('x', (d) => this.x(d[this.config.xId]))
      .attr('fill', (d) => {
        // return d.fill
        // return '#357392';
        return '#00bfa5';

      })
      .attr('width', this.x.bandwidth())
      .attr('y', this.graphHeight)
      .transition().duration(500)
      .attr('height', ((d) => {
        return this.graphHeight - this.y(d[this.config.yId]);
      }))
      .attr('y', (d) => this.y(d[this.config.yId]));

    // add event listener
    if (this.config.hoverEnable) {
      d3.selectAll('rect')
        .attr('class', 'eventListeners')
        .on('mouseover', (d, i, n) => {
          this.handleMouseOver(d, i, n);
        })
        .on('mouseout', (d, i, n) => this.handleMouseOut(d, i, n))
    }

    if (this.config.onClickEnable) {
      d3.selectAll('rect')
        .attr('class', 'eventListeners')
        .on('click', (d, i, n) => this.handleClickEvent(d, i, n));
    }


    const xAxis = d3Axis.axisBottom(this.x);
    const yAxis = d3Axis.axisLeft(this.y)
      .tickFormat(d => d + ' ' + this.config.yUnitName);
    this.xAxisGroup.call(xAxis);
    this.yAxisGroup.call(yAxis);
    this.xAxisGroup.selectAll('text')
      .attr('transform', 'rotate(-40)')
      .attr('text-anchor', 'end');

  }

  ngOnChanges(changes: any) {
    console.log(changes);
    console.log(this.isInputDataAvailable);
    if (this.isInputDataAvailable === true) {
      this.update(this.data);
    }
  }

  private handleMouseOver(d, i, n) {

    d3.select(n[i])
      .transition('changeSliceFill').duration(300)
      .attr('fill', 'gray')
      .attr('transform', 'scale(1.009)');
  }

  private handleMouseOut(d, i, n) {
    d3.select(n[i])
      .transition('changeSliceFill').duration(300)
      .attr('transform', 'scale(1)')
      .attr('fill', '#357392');
  }

  private handleClickEvent(d, i, n) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Do you confirm the deletion of this data?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.chartService.deleteChartData(d.id, 'dishes');
      }
    });
  }

}
