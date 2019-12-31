import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { PiChartData } from '../../shared/interfaces/interface'

@Injectable({
  providedIn: 'root'
})
export class PieChartService {

  constructor(
    private firestore: AngularFirestore) { }

  getPieChartData() {
    return this.firestore.collection('expenses').snapshotChanges();
  }

  addPieChartData(data: PiChartData) {
    return this.firestore.collection('expeneses').add(data);
  }
}
