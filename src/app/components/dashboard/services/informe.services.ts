import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InformeStock } from '../models/informeStock.models';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class InformeService {    
    private apiUrl = `${environment.apiUrl}/informes`;

    constructor(private http: HttpClient) {}

    getInformes(): Observable<InformeStock[]> {
    return this.http.get<InformeStock[]>(`${this.apiUrl}/stock`);
  }
}