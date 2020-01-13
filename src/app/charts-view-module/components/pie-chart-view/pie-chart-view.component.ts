import { Component, OnInit, Input, OnChanges } from '@angular/core';

// D3 dependencies
import * as d3 from 'd3';
import * as d3Shape from 'd3-shape';
import d3Tip from 'd3-tip';
import * as d3Scale from 'd3-scale';
import { PiChartData } from 'src/app/shared/interfaces/interface';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';
import { ChartService } from 'src/app/shared/services/chart.service';
import { legendColor } from 'd3-svg-legend';


@Component({
  selector: 'app-pie-chart-view',
  templateUrl: './pie-chart-view.component.html',
  styleUrls: ['./pie-chart-view.component.scss']
})
export class PieChartViewComponent implements OnInit, OnChanges {

  @Input() data: PiChartData;
  public isInputDataAvailable: boolean;
  private dims = { height: 300, width: 300, radius: 150 };
  private cent = { x: (this.dims.width / 2 + 5), y: (this.dims.height / 2 + 5) };
  private svg: any;
  private pie: any;
  private colour: any;
  private arcGenerator: any;
  legendGroup: any;
  legend: any;
  tip: any;

  @Input() config: {

    optionName: string; // xLabel
    valueName: string; // yLabel
    onClickEnable: boolean
    hoverEnable: boolean;
    legendColor: string

  } = {
      optionName: 'name',
      valueName: 'cost',
      onClickEnable: true,
      hoverEnable: false,
      legendColor: 'black'
    };

  constructor(public dialog: MatDialog, private chartService: ChartService) { }

  ngOnInit() {
    this.initSvgAndPie();
    this.arcGenerator = d3Shape.arc()
      .outerRadius(this.dims.radius)
      .innerRadius(this.dims.radius / 2);

    this.colour = d3Scale.scaleOrdinal(d3['schemeSet3']);
    // this.colour = d3Scale.scaleOrdinal().range(['red','black','green','pink','blue']);

    this.isInputDataAvailable = true;
    this.update(this.data);
    this.chartService.emitPageId(3);
  }

  private initSvgAndPie() {
    const width = this.dims.width + 150;
    const height = this.dims.height + 150;
    this.svg = d3.select('.canvas')
      .append('svg')
      // .attr('viewBox', `0,0,${width},${height}`)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${this.cent.x}, ${this.cent.y})`);

    this.pie = d3Shape.pie()
      .sort(null)
      .value((d: any) => d[this.config.valueName]);


    this.legendGroup = this.svg.append('g')
      .attr('transform', `translate(${this.cent.x + 15}, -80)`)
      .attr('fill', this.config.legendColor );

    this.legend = legendColor().shape('circle');
    this.tip = d3Tip()
      .attr('class', 'tip card')
      .html(d => {
        let content = `<div style="border-radius:8px; padding: 2px; background: white; z-index: 1000; border: solid 1px;" class="tip-container"> <div class="name">${d.data[this.config.optionName]}</div>`;
        content += `<div class="cost">${this.config.valueName} : ${d.data[this.config.valueName]}</div>`;
        content += `<div class="delete">Click slice to delete</div> </div>`;
        return content;
      });
    this.svg.call(this.tip);
  }

  private update(data) {
    // update colour scale domain
    this.colour.domain(data.map(d => d[this.config.optionName]));

    // update legend
    this.legend.scale(this.colour);
    this.legendGroup.call(this.legend);

    // join enhanced (pie) data to path elements
    const pieChartData = this.pie(data);
    console.log('paths', pieChartData);

    pieChartData.forEach(el => {
      el.startAngle += Math.PI;
      el.endAngle += Math.PI;
    });

    const paths = this.svg.selectAll('path')
      .data(pieChartData);

    console.log('paths', pieChartData);

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
      .attr('fill', d => this.colour(d.data[this.config.optionName]))
      // .transition().duration(750).attrTween('d', this.arcTweenEnter);
      .transition().duration(750).attr('d', this.arcGenerator);

    // add event listener
    d3.selectAll('path')
      .attr('class', 'eventListeners')
      .on('mouseover', (d, i, n) => {
        this.handleMouseOver(d, i, n);
        this.tip.show(d, n[i]);
      })
      .on('mouseout', (d, i, n) => this.handleMouseOut(d, i, n))
      .on('click', (d, i, n) => this.handleClickEvent(d, i, n));
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

  private handleMouseOut(d, i, n) {
    this.tip.hide(d);
    d3.select(n[i])
      .transition('changeSliceFill').duration(300)
      .attr('transform', 'scale(1)')
      .attr('fill', this.colour(d.data[this.config.optionName]));
  }

  private handleClickEvent(d, i, n) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Do you confirm the deletion of this data?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.chartService.deleteChartData(d.data.id, 'expenses');
      }
    });
  }
}
