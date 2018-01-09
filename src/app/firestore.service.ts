import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { expand, takeWhile, tap, mergeMap, take } from 'rxjs/operators';
import * as faker from 'faker';

@Injectable()
export class FirestoreService {

  colRef = this.afs.collection('widgets', ref => ref.orderBy('__name__'))

  constructor(private afs: AngularFirestore) { }



  // Helper to quickly generate dummy data
  generateData(size: number) {
    for (const i of Array(size)) {  
      const dummyData = {
        name: faker.commerce.product(),
        color: faker.commerce.color(),
        brand: faker.company.companyName(),
        price: faker.commerce.price()
      }

      this.colRef.add(dummyData);
    }
    
  }



  deleteCollection(path: string, batchSize: number): Observable<any> {

    const source = this.deleteBatch(path, batchSize)

    // expand will call deleteBatch recursively until the collection is deleted
    return source.pipe(
      expand(val => this.deleteBatch(path, batchSize)),
      takeWhile(val => val > 0)
   )

  }


  // Detetes documents as batched transaction
  private deleteBatch(path: string, batchSize: number): Observable<any> {
    const colRef = this.afs.collection(path, ref => ref.orderBy('__name__').limit(batchSize) )

    return colRef.snapshotChanges().pipe(
      take(1),
      mergeMap(snapshot => {

        // Delete documents in a batch
        const batch = this.afs.firestore.batch();
        snapshot.forEach(doc => {
            batch.delete(doc.payload.doc.ref);
        });

        return fromPromise( batch.commit() ).map(() => snapshot.length)

      })
    )

  }

  



}
