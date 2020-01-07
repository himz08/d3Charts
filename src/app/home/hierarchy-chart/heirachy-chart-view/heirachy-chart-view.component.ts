import { Component, OnInit, Input, OnChanges } from '@angular/core';

// D3 dependencies
import * as d3 from 'd3';
import * as d3Shape from 'd3-shape';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';
import * as d3Array from 'd3-array';
import * as d3Time from 'd3-time-format';
import * as d3Hierarchy from 'd3-hierarchy';
import { HChartData } from 'src/app/shared/interfaces/interface';
import { ChartService } from 'src/app/shared/services/chart.service';
import {
  sankey as d3Sankey,
  sankeyLinkHorizontal
} from 'd3-sankey';
@Component({
  selector: 'app-heirachy-chart-view',
  templateUrl: './heirachy-chart-view.component.html',
  styleUrls: ['./heirachy-chart-view.component.scss']
})
export class HeirachyChartViewComponent implements OnInit, OnChanges {

  private dims = { width: 1100, height: 500 };
  private margin = { top: 50, left: 50, right: 50, bottom: 50 };
  private svg;
  private graph;
  private startify;
  private treeGen: any;
  private color: any;
  isInputDataAvailable;
  @Input() data: HChartData[] = [];

  constructor() { }

  ngOnInit() {
    this.initSvgAndGraoh();
    this.dataManipulation();
    this.isInputDataAvailable = true;
    // this.update(this.data);
  }

  private initSvgAndGraoh() {
    const width = this.dims.width + this.margin.left + this.margin.right;
    const height = this.dims.height + this.margin.top + this.margin.bottom;
    this.svg = d3.select('.canvas')
      .append('svg')
      .attr('viewBox', `0,0,${width},${height}`);
      // .attr('width', this.dims.width + this.margin.left + this.margin.right)
      // .attr('height', this.dims.height + this.margin.top + this.margin.bottom);

    this.graph = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.treeGen = d3Hierarchy.tree().size([this.dims.width, this.dims.height]);

    this.color = d3Scale.scaleOrdinal(d3['schemeSet3']);

  }

  private dataManipulation() {
    this.startify = d3Hierarchy.stratify().id((d: HChartData) => d.name).parentId((d: HChartData) => d.parent);
    // this.update(this.data);
  }

  private update(data: HChartData[]) {

  this.color.domain(data.map(d => d.department));

      // remove current nodes
  this.graph.selectAll('.node').remove();
  this.graph.selectAll('.link').remove();

  // get updated root Node data
  const rootNode = this.startify(data);
  const treeData = this.treeGen(rootNode).descendants();
  
  // get nodes selection and join data
  const nodes = this.graph.selectAll('.node')
    .data(treeData);

  // get link selection and join new data
  const link = this.graph.selectAll('.link')
    .data(this.treeGen(rootNode).links());
  
    console.log(this.treeGen(rootNode).links())

  // enter new links
  link.enter()
    .append('path')
      .transition().duration(300)
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#aaa')
      .attr('stroke-width', 2)
      .attr('d', d3Shape.linkHorizontal().x((d: any) => d.x).y((d: any) => d.y));
      // .attr('d', (d) => sankeyLinkHorizontal().x(d.x).y(d.y))

  // create enter node groups
  const enterNodes = nodes.enter()
    .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);
      
  // append rects to enter nodes
  enterNodes.append('rect')
    .attr('fill', d => this.color(d.data.department))
    .attr('stroke', '#555')
    .attr('stroke-width', 2)
    .attr('width', d => d.data.name.length * 20)
    .attr('height', 50)
    .attr('transform', d => {
      var x = d.data.name.length * 10
      return `translate(${-x}, ${-25})`
    });

  enterNodes.append('text')
    .attr('text-anchor', 'middle')
    .attr('fill', 'black')
    .text(d => d.data.name); 
  }

  ngOnChanges(changes: any) {
    console.log(changes);
    console.log(this.isInputDataAvailable);
    if (this.isInputDataAvailable === true) {
      this.update(this.data);
    }
  }
}
