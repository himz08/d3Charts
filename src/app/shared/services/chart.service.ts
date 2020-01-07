import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { PiChartData, BarChartData, HChartData } from '../interfaces/interface';
import { CommonService } from './common.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(
    private firestore: AngularFirestore, private commonService: CommonService) { }

    activePageId = new Subject<number>();

// Pie Chart
  getPieChartData() {
    return this.firestore.collection('expenses').snapshotChanges();
  }

  addPieChartData(data: PiChartData) {
    return this.firestore.collection('expenses').add(data);
  }

  addBarChartData(data: BarChartData) {
    return this.firestore.collection('dishes').add(data);
  }

  addHChartData(data: HChartData) {
    return this.firestore.collection('empTree').add(data);
  }

  getHChartData() {
    return this.firestore.collection('empTree').snapshotChanges();
  }

  deleteChartData(id: string, collectionname: string) {
    this.firestore.collection(collectionname).doc(id).delete().then(() => {
      this.commonService.openSnackBar('Deleted !', 'Ok');
    }).catch((error) => {
      console.error('Error removing document: ', error);
  });  }


// Bar Chart
  getBarChartData() {
    return this.firestore.collection('dishes').snapshotChanges();
  }

  addDataToBarChart(data: {
    Name: string,
    Orders: number
  }) {
    return this.firestore.collection('dishes').add(data);
  }


// Line Chart
  addDataToLineChart(data: {
    distance: number,
    server: number,
    date: string;
  }) {
    return this.firestore.collection('servers').add(data);
  }

  getLineChartData() {
    return this.firestore.collection('servers').snapshotChanges();
  }

  emitPageId(id: number) {
    this.activePageId.next(id);
  }
}
