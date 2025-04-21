import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface OrderItem {
  id: number;
  nombre: string;
  categoria: string;
  cantidadSolicitada: number;
}

export interface Order {
  orderId: string;
  items: OrderItem[];
  fechaCreacion: string;
  fechaEntrega: string;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.http.get<Order[]>('http://localhost:3000/api/orders')
      .subscribe({
        next: (orders) => {
          this.orders = orders;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.errorMessage = 'Error al cargar las órdenes. Por favor, intente nuevamente.';
          this.isLoading = false;
        }
      });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
} 