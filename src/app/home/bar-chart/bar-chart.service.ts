import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class BarChartService {

  constructor(
     private firestore: AngularFirestore) {}
     getBarChartData() {
      return this.firestore.collection('dishes').snapshotChanges();
    }
}
