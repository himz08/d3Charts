import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DruidData } from '../shared/interfaces/interface';
import { map } from 'rxjs/operators';

export const configForBarChart = {
  scaleType: 'scaleBand',
  xPoints: null,
  yPoints: null,
  yUnitName: '%  ',
  xId: 'instance_name',
  yId: 'average',
  onClickEnable : false,
  hoverEnable : true,
  axisColor: '#ccc'
};

export const configForLineChart = {
  scaleType: 'scaleTime',
  xPoints: null,
  yPoints: null,
  yUnitName: 'Orders',
  xId: 'timestamp',
  yId: 'average',
  onClickEnable: false,
  hoverEnable: true,
  axisColor: '#ccc',
  dateTimeRepXaxis: '%c'
};

export const configForPieChart = {
  optionName: 'instance_name',
  valueName: 'average',
  onClickEnable: true,
  hoverEnable: false,
  legendColor: '#ccc',
};

@Injectable({
  providedIn: 'root'
})
export class DruidService {

  apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  getDruidData(key: string) {
    return this.http.get<DruidData>(`${this.apiUrl}/${key}/`);
  }

}
