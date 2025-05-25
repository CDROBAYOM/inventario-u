import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.models';

@Injectable({
    providedIn: 'root'
})

export class PedidoService {
    
    private apiUrl = 'http://localhost:3000/api/pedidos';

    constructor(private http: HttpClient) { }

    getPedidos(): Observable<Pedido[]> {
        return this.http.get<Pedido[]>(this.apiUrl);
    }

    createPedido(pedido: Pedido): Observable<Pedido> {
        return this.http.post<Pedido>(this.apiUrl, pedido);
    }

    updatePedido(pedido: Pedido): Observable<Pedido> {
        return this.http.put<Pedido>(`${this.apiUrl}/${pedido.pedidoId}`, pedido);
    }

}