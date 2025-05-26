import { Producto } from "../../producto/models/producto.model";

export interface Pedido {    
    pedidoId: string;
    cantidad: string;
    estado: string;
    total: number;
    coordinacionId: string;
    categoria: string;
    productos: Producto[];
    personaQueRecoge: string;    
    observaciones: string;
}

