import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({
    providedIn: 'root'
})

export class ProductoService {

    private apiUrl = 'http://localhost:3000/api/productos';

    constructor(private http: HttpClient) { }

    getProductos(): Observable<Producto[]> {
        return this.http.get<Producto[]>(this.apiUrl);
    }

    getProducto(id: string): Observable<Producto> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Producto>(url);
    }

    createProducto(producto: Producto | FormData): Observable<Producto> {
        return this.http.post<Producto>(this.apiUrl, producto);
    }

    updateProducto(id: string, producto: Producto | FormData): Observable<Producto> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.put<Producto>(url, producto);
    }

    deleteProducto(id: string): Observable<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete<void>(url);
    }

} 