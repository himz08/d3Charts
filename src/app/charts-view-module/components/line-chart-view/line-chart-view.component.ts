import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';


// D3 dependencies
import * as d3 from 'd3-selection';
import * as d3Shape from 'd3-shape';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';
import * as d3Array from 'd3-array';
import * as d3Time from 'd3-time-format';
import { LineChartData } from 'src/app/shared/interfaces/interface';
import { ChartService } from 'src/app/shared/services/chart.service';


@Component({
  selector: 'app-line-chart-view',
  templateUrl: './line-chart-view.component.html',
  styleUrls: ['./line-chart-view.component.scss']
})
export class LineChartViewComponent implements OnInit, OnChanges {

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
    hoverEnable: boolean;
    axisColor: string;
    dateTimeRepXaxis: string

  } = {
      scaleType: 'scaleTime',
      xPoints: null,
      yPoints: null,
      yUnitName: 'Orders',
      xId: 'date',
      yId: 'distance',
      onClickEnable: true,
      hoverEnable: true,
      axisColor: 'black',
      dateTimeRepXaxis: '%B %d'
    };

  graphWidth = 560 - this.margin.left - this.margin.right;
  graphHeight = 400 - this.margin.top - this.margin.bottom;
  isInputDataAvailable;
  svg: any;
  graph: any;
  xAxisGroup: any;
  yAxisGroup: any;
  xAxis: any;
  yAxis: any;
  x: any;
  y: any;
  line: any;
  path: any;

  @Input() data: any[] = [];

  constructor(public dialog: MatDialog, private chartService: ChartService) { }

  ngOnInit() {
    this.initSvg();
    this.initAxisAndScales();
    this.isInputDataAvailable = true;
    console.log('+========> ', this.data);
    this.update(this.data);
  }

  private initSvg() {
    const width = this.graphWidth + this.margin.left + this.margin.right;
    const height = this.graphHeight + this.margin.top + this.margin.bottom;
    document.querySelector('.canvas').innerHTML = '';
    this.svg = d3.select('.canvas')
      .append('svg')
      .attr('viewBox', `0,0,${width},${height}`);

    this.graph = this.svg.append('g').attr('width', this.graphWidth)
      .attr('height', this.graphHeight)
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
    this.path = this.graph.append('path');
  }

  private initAxisAndScales() {

    this.x = d3Scale.scaleTime().range([0, this.graphWidth]);
    this.y = d3Scale.scaleLinear().range([this.graphHeight, 0]);
    this.xAxisGroup = this.graph
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${this.graphHeight})`);

    this.yAxisGroup = this.graph
      .append('g')
      .attr('class', 'y-axis');

    this.line = d3Shape.line()
    .x((d: any) => this.x(new Date(d[this.config.xId])))
    .y((d: any) => this.y(d[this.config.yId]));

  }

  private update(data: any[]) {

    // data sorting
    data.sort((a, b) => (new Date(a.date) as any) - (new Date(b.date) as any));
    // Set scale domains
    this.x.domain(d3Array.extent(data, d => new Date(d[this.config.xId])));
    this.y.domain([0, d3Array.max(data, d => d[this.config.yId])]);

    // update path data
    this.path.data([data])
      .attr('fill', 'none')
      .attr('stroke', '#00bfa5')
      .attr('stroke-width', 2)
      .attr('d', this.line);

    // create circles objects
    const circles = this.graph.selectAll('circle').data(data);

    // remove unwanted
    circles.exit().remove();

    // update current
    circles.attr('cy', d => this.y(d[this.config.yId]))
      .attr('cx', d => this.x(new Date(d[this.config.xId])));

    circles.enter().append('circle')
      .attr('r', 4)
      .attr('cy', d => this.y(d[this.config.yId]))
      .attr('cx', d => this.x(new Date(d[this.config.xId])))
      .attr('fill', this.config.axisColor);

    // create axis
    this.xAxis = d3Axis.axisBottom(this.x).ticks(4).tickFormat(d3Time.timeFormat(this.config.dateTimeRepXaxis));
    this.yAxis = d3Axis.axisLeft(this.y).ticks(4);

    // call axis
    this.xAxisGroup.call(this.xAxis)
                    .attr('stroke', `${this.config.axisColor}`)
                    .attr('stroke-width', 1);
    this.yAxisGroup.call(this.yAxis)
                    .attr('stroke', `${this.config.axisColor}`)
                    .attr('stroke-width', 1);
    // Coloring the axis
    this.xAxisGroup.select('path')
                    .attr('stroke', this.config.axisColor);
    this.xAxisGroup.selectAll('line')
                    .attr('stroke', this.config.axisColor);
    this.yAxisGroup.select('path')
                    .attr('stroke', this.config.axisColor);
    this.yAxisGroup.selectAll('line')
                    .attr('stroke', this.config.axisColor);
    // rotate axis text
    this.xAxisGroup.selectAll('text')
      .attr('transform', 'rotate(-40)')
      .attr('text-anchor', 'end')
      .attr('style',  `color: ${this.config.axisColor}`);

    // add listeners
    if (this.config.onClickEnable) {
      this.graph.selectAll('circle')
      .on('click', (d, i , n) => this.handleClickEvent(d, i , n));
    }

    if (this.config.hoverEnable) {
      this.graph.selectAll('circle')
      .on('mouseover', (d, i, n) => this.handleMouseOver(d, i, n))
      .on('mouseout', (d, i, n) => this.handleMouseOut(d, i, n));
        }
    }
    private handleMouseOver(d, i , n) {
      d3.select(n[i]).transition('circleIncrease').duration(100)
      .attr('r', 8)
      .attr('fill', 'gray');

      console.log(d);
      this.graph.append('line')
          .attr('x1', this.x(new Date(d[this.config.xId])))
          .attr('y1', this.y(d[this.config.yId]))
          .attr('x2', this.x(new Date(d[this.config.xId])))
          .attr('y2' , this.graphHeight)
          .attr('stroke', 'gray')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', 4);

      this.graph.append('line')
          .attr('x1', this.x(new Date(d[this.config.xId])))
          .attr('y1', this.y(d[this.config.yId]))
          .attr('x2', 0)
          .attr('y2' , this.y(d[this.config.yId]))
          .attr('stroke', 'gray')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', 4) ;
    }

    private handleMouseOut(d, i , n) {
      d3.select(n[i]).transition('circleIncrease').duration(100)
      .attr('r', 4)
      .attr('fill', 'black');

      d3.selectAll('line').transition().duration(200).remove();
    }

    private handleClickEvent(d, i , n) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: 'Do you confirm the deletion of this data?'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log('Yes clicked');
          this.chartService.deleteChartData(d.id, 'servers');
        }
      });
    }
    ngOnChanges(changes: any) {
      console.log(changes);
      console.log(this.isInputDataAvailable);
      if (this.isInputDataAvailable === true) {
        this.update(this.data);
      }
    }

  }
