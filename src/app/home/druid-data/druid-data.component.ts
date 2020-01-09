import { Component, OnInit } from '@angular/core';
import { DruidService } from './druid.service';
import { DruidData } from '../../shared/interfaces/interface';

@Component({
  selector: 'app-druid-data',
  templateUrl: './druid-data.component.html',
  styleUrls: ['./druid-data.component.scss']
})
export class DruidDataComponent implements OnInit {

  constructor(private service: DruidService) { }
  config = {
    scaleType: 'scaleBand',
    xPoints: null,
    yPoints: null,
    yUnitName: '%',
    xId: 'instance_name',
    yId: 'average',
    onClickEnable : false,
    hoverEnable : true
  };

  dataCPU: DruidData[] = [];
  dataMEM: DruidData[] = [];

  ngOnInit() {
    this.service.getDruidData('allCPU').subscribe((res: any) => {
      res.forEach(el => {
        el.instance_name = el.event.instance_name;
        el.average = el.event.average;
      });
      console.log(res);
      this.dataCPU = res;
    });
    this.service.getDruidData('allMEM').subscribe((res: any) => {
      res.forEach(el => {
        el.instance_name = el.event.instance_name;
        el.average = el.event.average;
      });
      console.log(res);
      this.dataMEM = res;
    });
  }


}
