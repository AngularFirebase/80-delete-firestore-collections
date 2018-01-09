import { Component, OnInit } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  widgets$: Observable<any>;

  constructor(public db: FirestoreService) { }

  ngOnInit() { 
    this.widgets$ = this.db.colRef.valueChanges()
  }

  deleteWidgets() {
    this.db.deleteCollection('widgets', 5).subscribe()
  }


}