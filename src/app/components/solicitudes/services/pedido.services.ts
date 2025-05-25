import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  getPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl);
  }
} 