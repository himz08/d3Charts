import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { DruidData } from './shared/interfaces/interface';
import { CommonService } from './shared/services/common.service';
// import { ConfirmationDialogComponent } from './shared/components/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {



  constructor(private http: HttpClient) { }
  title = 'd3Charts';

  ngOnInit() {

    // const header = {
    //   headers: new HttpHeaders({
    //     ContentType:  'application/json',
    //     'Access-Control-Allow-Origin': '*',
    //     crossDomain: 'true'
    //   })
    // };
    // const body = {
    //   "dataSource": "spyagent",
    //   "queryType": "groupBy",
    //   "dimensions": [
    //     "project_uuid",
    //     "other_details",
    //     "instance_name",
    //     "instance_uuid",
    //     "metric_type"
    //   ],
    //   "granularity": "all",
    //   "aggregations": [
    //     {
    //       "type": "doubleSum",
    //       "name": "double_sum",
    //       "fieldName": "value_doub_sum"
    //     },
    //     {
    //       "type": "count",
    //       "name": "total",
    //       "fieldName": "count"
    //     }
    //   ],
    //   "postAggregations": [
    //     {
    //       "type": "javascript",
    //       "name": "average",
    //       "fieldNames": [
    //         "double_sum",
    //         "total"
    //       ],
    //       "function": "function(double_sum, total) { return double_sum / total; }"
    //     }
    //   ],
    //   "intervals": [
    //     "2020-01-02T11:40:16.101Z/2020-01-02T11:46:16.100Z"
    //   ],
    //   "filter": {
    //     "type": "and",
    //     "fields": [
    //       {
    //         "type": "selector",
    //         "dimension": "measurement_type",
    //         "value": "VM"
    //       },
    //       {
    //         "type": "or",
    //         "fields": [
    //           {
    //             "type": "selector",
    //             "dimension": "metric_type",
    //             "value": "cpu"
    //           }
    //         ]
    //       },
    //       {
    //         "type": "or",
    //         "fields": [
    //           {
    //             "type": "selector",
    //             "dimension": "project_uuid",
    //             "value": "7a6db2b2-a584-4429-b14e-2abd265c38ca"
    //           }
    //         ]
    //       }
    //     ]
    //   }
    // };
    // this.http.post('https://192.168.206.10/druid/druid/v2/?pretty', body, header).subscribe(res => {
    //   console.log('*--------->', res);
    // }, (err) => {
    //   console.log('Error :( ', err);
    // });

    this.http.get<DruidData[]>('http://localhost:3000/allCPU').subscribe(res => {
      console.log(' :) =---> ', res);
    })
  }

private handleRes() {

}

}
