import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StoreData } from '../models/store.models';

@Injectable({ providedIn: 'root' })
export class ProductDataService {
  constructor(private http: HttpClient) {}

  getStoreData(): Observable<StoreData> {
    return this.http.get<StoreData>('data/store-data.json');
  }
}
