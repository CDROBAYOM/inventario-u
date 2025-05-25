export interface Pedido {
  pedidoId: string;
  cantidad: string;
  estado: string;
  total: number;
  coordinacionId: string;
  categoria: string;
  productos: any[];
  personaQueRecoge: string;
} 