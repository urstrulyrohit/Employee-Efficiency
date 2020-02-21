import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FsService {
  information: Observable<any[]>;
  informationRef: AngularFireList<any>;
  constructor(private http: HttpClient, private db: AngularFireDatabase) {

  }

  getInformation() {
    this.informationRef = this.db.list('information');
    this.information = this.informationRef.valueChanges();
    return this.information;
  }
}
