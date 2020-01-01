import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

// D3 dependencies
import * as d3 from 'd3';
import * as d3Shape from 'd3-shape';
import * as d3Interpolate from 'd3-interpolate';
import * as d3Scale from 'd3-scale';
import { PiChartData } from 'src/app/shared/interfaces/interface';



@Component({
  selector: 'app-pie-chart-view',
  templateUrl: './pie-chart-view.component.html',
  styleUrls: ['./pie-chart-view.component.scss']
})
export class PieChartViewComponent implements OnInit, OnChanges {

  @Input() data: PiChartData;
  @Output() deleteData = new EventEmitter<string>();
  public isInputDataAvailable: boolean;
  private dims = { height: 300, width: 300, radius: 150 };
  private cent = { x: (this.dims.width / 2 + 5), y: (this.dims.height / 2 + 5) };
  private svg: any;
  private pie: any;
  private colour: any;
  private arcGenerator: any;

  constructor() { }

  ngOnInit() {
    this.initSvgAndPie();
    this.arcGenerator = d3Shape.arc()
      .outerRadius(this.dims.radius)
      .innerRadius(this.dims.radius / 2);

    this.colour = d3Scale.scaleOrdinal(d3['schemeSet3']);

    this.isInputDataAvailable = true;
    console.log('------->', this.data);
    this.update(this.data);
  }

  private initSvgAndPie() {
    this.svg = d3.select('.canvas')
      .append('svg')
      .attr('width', this.dims.width + 150)
      .attr('height', this.dims.height + 150)
      .append('g')
      .attr('transform', `translate(${this.cent.x}, ${this.cent.y})`);

    this.pie = d3Shape.pie()
      .sort(null)
      .value((d: any) => d.cost);
  }

  private update(data) {
    // update colour scale domain
    this.colour.domain(data.map(d => d.name));
    // join enhanced (pie) data to path elements
    const paths = this.svg.selectAll('path')
      .data(this.pie(data));
    // handle the exit selection
    paths.exit().remove();
    // handle the current DOM path updates
    paths.attr('d', this.arcGenerator);
    paths.enter()
      .append('path')
      .attr('class', 'arc')
      // .attr('d', this.arcGenerator)
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .attr('fill', d => this.colour(d.data.name))
      // .transition().duration(750).attrTween('d', this.arcTweenEnter);
      .transition().duration(750).attr('d', this.arcGenerator);

    // add event listener
    d3.selectAll('path')
      .attr('class', 'eventListeners')
      .on('mouseover', (d, i, n) => this.handleMouseOver(d, i , n))
      .on('mouseout', (d, i , n) => this.handleMouseOut(d , i, n))
      .on('click', (d, i , n) => this.handleClickEvent(d, i , n));

  }

  //    arcTweenEnter = (d) => {
  //     var i = d3.interpolate(d.endAngle, d.startAngle);
  //         return function(t) {
  //             d.startAngle = i(t);
  //             return this.arcGenerator(d);
  //         }
  // }

  ngOnChanges(changes: any) {
    if (this.isInputDataAvailable === true) {
      this.update(this.data);
    }
  }

  private handleMouseOver(d, i, n) {
    d3.select(n[i])
    .transition('changeSliceFill').duration(300)
      .attr('fill', 'gray')
      .attr('transform', 'scale(1.02)');
  }

  private handleMouseOut(d, i , n) {
    d3.select(n[i])
    .transition('changeSliceFill').duration(300)
      .attr('transform', 'scale(1)')
      .attr('fill', this.colour(d.data.name));
  }

  private handleClickEvent(d, i , n) {
    this.deleteData.emit(d.data.id);
  }
}
