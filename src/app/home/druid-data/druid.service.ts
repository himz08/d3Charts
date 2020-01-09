import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DruidData } from '../../shared/interfaces/interface';
import { map } from 'rxjs/operators';

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
