import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

export interface OrderItem {
  id: string;
  nombre: string;
  categoria: string;
  cantidadSolicitada: number;
  _id: string;
}

export interface Order {
  _id: string;
  deliveryStatus: string;
  items: OrderItem[];
  orderId: string;
  applicationDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading = true;
  errorMessage = '';
  searchTerm: string = '';
  searchDate: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.http.get<Order[]>('http://localhost:3000/api/orders')
      .subscribe({
        next: (orders) => {
          console.log(orders);
          this.orders = orders;
          this.filteredOrders = [...orders];
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
    if (!dateString) return 'No disponible';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';

    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  getLastThreeChars(orderId: string): string {
    return orderId.slice(-5);
  }

  searchOrders(): void {
    if (!this.searchTerm && !this.searchDate) {
      this.filteredOrders = [...this.orders];
      return;
    }

    this.filteredOrders = this.orders.filter(order => {
      const matchesSearchTerm = this.searchTerm 
        ? order.orderId.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;

      const matchesDate = this.searchDate
        ? new Date(order.applicationDate).toISOString().split('T')[0] === this.searchDate
        : true;

      return matchesSearchTerm && matchesDate;
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchDate = '';
    this.filteredOrders = [...this.orders];
  }
} 