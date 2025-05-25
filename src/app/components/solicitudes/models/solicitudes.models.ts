import { Producto } from "../../producto/models/producto.model";

export interface Solicitud {
    coordinacionId: number;
    updatedAt: string;
    total: string;
    createdAt: number;
    estado: string;
    productos: Producto[];
}