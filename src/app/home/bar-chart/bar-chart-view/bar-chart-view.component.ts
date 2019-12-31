import { Component, OnInit, SimpleChanges, Input, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { BarChartService } from '../bar-chart.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService

// D3 dependencies
import * as d3 from 'd3-selection';
import * as d3Shape from 'd3-shape';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';
import * as d3Array from 'd3-array';
import { BarChartData } from 'src/app/shared/interfaces/interface';

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
  @Input() data: BarChartData[] = [];
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

  constructor(private chartService: BarChartService,
              private ngxLoader: NgxUiLoaderService
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
    this.y = d3Scale.scaleLinear()
      .range([this.graphHeight, 0]);

    this.x = d3Scale.scaleBand()
      .range([0, 450])
      .paddingInner(0.2)
      .paddingOuter(0.2);
  }

  private createAxis() {
    // Create Axis group
    this.xAxisGroup = this.svg.append('g')
      .attr('transform', `translate(0,${this.graphHeight})`);
    this.yAxisGroup = this.svg.append('g');
  }

  private update(data) {
    // Update scales
    this.x.domain(data.map(d => d.Name));
    this.y.domain([0, d3Array.max(data, (d: BarChartData) => d.Orders)]);


    // join data
    const rects = this.svg.selectAll('rect')
      .data(data);


    // remove unwanted
    rects.exit().remove();

    // aattr

    rects.attr('x', (d) => this.x(d.Name))
      .attr('fill', (d) => {
        // return d.fill
        return '#357392';
      })
      .attr('width', this.x.bandwidth())
      .transition().duration(500)
      .attr('height', d => this.graphHeight - this.y(d.Orders))
      .attr('y', (d) => this.y(d.Orders));


    rects.enter()
      .append('rect')
      .attr('x', (d) => this.x(d.Name))
      .attr('fill', (d) => {
        // return d.fill
        return '#357392';
      })
      .attr('width', this.x.bandwidth())
      .attr('y', this.graphHeight)
      .transition().duration(500)
      .attr('height', ((d) => {
        return this.graphHeight - this.y(d.Orders);
      }))
      .attr('y', (d) => this.y(d.Orders));

    const xAxis = d3Axis.axisBottom(this.x);
    const yAxis = d3Axis.axisLeft(this.y)
      .tickFormat(d => d + ' Orders');
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

}
