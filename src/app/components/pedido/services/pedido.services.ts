import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.models';
import { EntregaPedido } from '../models/entregaPedido.models';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class PedidoService {
    
    private apiUrl = environment.apiUrl + '/pedidos';

    constructor(private http: HttpClient) { }

    getPedidos(): Observable<Pedido[]> {
        return this.http.get<Pedido[]>(this.apiUrl);
    }

    createPedido(pedido: Pedido): Observable<Pedido> {
        return this.http.post<Pedido>(this.apiUrl, pedido);
    }

    updatePedido(pedido: Pedido): Observable<Pedido> {
        console.log(`${this.apiUrl}/${pedido.pedidoId}`);
        return this.http.put<Pedido>(`${this.apiUrl}/${pedido.pedidoId}`, pedido);
    }

    entregarPedido(pedido: EntregaPedido): Observable<EntregaPedido> {
        return this.http.put<EntregaPedido>(`${this.apiUrl}/${pedido.pedidoId}`, pedido);
    }

}