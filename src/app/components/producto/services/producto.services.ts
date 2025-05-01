import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class ProductoService {

    private apiUrl = `${environment.apiUrl}/productos`;

    constructor(private http: HttpClient) { }

    getProductos(): Observable<Producto[]> {
        return this.http.get<Producto[]>(this.apiUrl);
    }

    getCategorias(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/categorias`);
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