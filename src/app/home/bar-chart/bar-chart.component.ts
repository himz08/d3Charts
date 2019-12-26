import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import 'd3-transition';
import { BarChartData } from '../../shared/interfaces/interface';
import { BarChartService } from '../bar-chart/bar-chart.service';
import { Subscription } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService


@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit,  OnDestroy {

  public data: BarChartData[] = [];

  title = 'Bar Chart';

  // @Input() data: BarChartData;

  private margin = {
    top: 20,
    right: 20,
    bottom: 100,
    left: 100
  };
  private subscription: Subscription;
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  private line: d3Shape.Line<[number, number]>;
  xAxisGroup: any;
  yAxisGroup: any;

  constructor(private chartService: BarChartService,
              private ngxLoader: NgxUiLoaderService
    ) {
    this.width = 600 - this.margin.left - this.margin.right;
    this.height = 600 - this.margin.top - this.margin.bottom;

  }


  ngOnInit() {
    this.initSvg();
    this.setScales();
    this.createAxis();
    this.ngxLoader.start();
    this.subscription = this.chartService.getBarChartData().subscribe((res: any) => {
      this.ngxLoader.stop();
      console.log(res);
      res.forEach(change => {
        const doc = { ...change.payload.doc.data(), id: change.payload.doc.id };
        console.log(change.type);
        switch (change.type) {

          case 'added':
            this.data.push(doc);
            break;

          case 'modified':
            const index = this.data.findIndex(item => item.id === doc.id);
            // console.log(index);
            // console.log(this.data[index]);
            // console.log(doc);
            this.data[index] = doc;
            break;

          case 'removed':
            this.data = this.data.filter(item => item.id !== doc.id);
            break;

          default:
            break;
        }
      });
      this.update(this.data);
    });
  }

  private initSvg() {
    this.svg = d3.select('svg')
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private setScales() {
    // scale manipulation
    this.y = d3Scale.scaleLinear()
      .range([this.height, 0]);

    this.x = d3Scale.scaleBand()
      .range([0, 450])
      .paddingInner(0.2)
      .paddingOuter(0.2);
  }

  private createAxis() {
    // Create Axis group
    this.xAxisGroup = this.svg.append('g')
      .attr('transform', `translate(0,${this.height})`);
    this.yAxisGroup = this.svg.append('g');
  }
  private update(data) {
    // Update scales
    this.y.domain([0, d3Array.max(data, (d: BarChartData) => d.Orders)]);
    this.x.domain(data.map(d => d.Name));

    // join data
    const rects = this.svg.selectAll('rect')
      .data(data);


    // remove unwanted
    rects.exit().remove();

    // aattr

    rects.attr('x', (d) => this.x(d.Name))
      .attr('fill', (d) => {
        // return d.fill
        return 'orange';
      })
      .attr('width', this.x.bandwidth())
      .transition().duration(500)
      .attr('height', d => this.height - this.y(d.Orders))
      .attr('y', (d) => this.y(d.Orders));


    rects.enter()
      .append('rect')
      .attr('x', (d) => this.x(d.Name))
      .attr('fill', (d) => {
        // return d.fill
        return '#357392';
      })
      .attr('width', this.x.bandwidth())
      .attr('y', this.height)
      .attr('height', 0)
      .transition().duration(500)
      .attr('height', ((d) => {
        return this.height - this.y(d.Orders);
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

