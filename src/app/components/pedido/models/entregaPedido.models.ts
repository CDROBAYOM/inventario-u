import { Pedido } from "./pedido.models";

export interface EntregaPedido {
    pedidoId: string;
    estado: string;
    personaQueRecogio: string;
    observaciones: string;
}

