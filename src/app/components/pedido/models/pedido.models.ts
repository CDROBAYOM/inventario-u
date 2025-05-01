import { Producto } from "../../producto/models/producto.model";

export interface Pedido {    
    cantidad: string;
    estado: string;
    total: number;
    coordinacionId: string;
    categoria: string;
    productos: Producto[];
    personaQueRecoge: string;    
}

