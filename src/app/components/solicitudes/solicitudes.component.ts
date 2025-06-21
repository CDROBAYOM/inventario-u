import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PedidoService } from '../pedido/services/pedido.services';
import { Pedido } from '../pedido/models/pedido.models';

interface EntregaPedido {
  pedidoId: string;
  estado: string;
  personaQueRecogio: string;
  observaciones: string;
}

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: [],
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule]
})
export class SolicitudesComponent implements OnInit {
  isLoading = true;
  errorMessage = '';
  searchTerm: string = '';
  searchDate: string = '';
  pedidos: Pedido[] = [];
  filteredOrders: Pedido[] = [];
  statusFilter: string = 'ALL';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  expandedOrders: Set<string> = new Set();
  showProductsModal = false;
  showDeliveryModal = false;
  selectedOrder: Pedido | null = null;
  deliveryForm: FormGroup;

  constructor(
    private pedidoService: PedidoService,
    private fb: FormBuilder
  ) {
    this.deliveryForm = this.fb.group({
      estado: ['', Validators.required],
      recipient: ['', Validators.required],
      observations: ['']
    });
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.pedidoService.getPedidos().subscribe({
      next: (pedidos: Pedido[]) => {
        console.log(pedidos);
        this.pedidos = pedidos;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading orders:', error);
        this.errorMessage = 'Error al cargar los pedidos';
        this.isLoading = false;
      }
    });
  }

  applyStatusFilter(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }

  applyFilters(): void {
    this.currentPage = 1;
    let filtered = [...this.pedidos];

    // Status filter
    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter(p => p.estado === this.statusFilter);
    }

    // Search term filter
    if (this.searchTerm) {
      const lowerCaseSearch = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.pedidoId.toLowerCase().includes(lowerCaseSearch) ||
        order.categoria.toLowerCase().includes(lowerCaseSearch) ||
        order.personaQueRecogio.toLowerCase().includes(lowerCaseSearch)
      );      
    }

    this.filteredOrders = filtered;
  }

  getPaginatedOrders(): Pedido[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredOrders.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  getLastThreeChars(orderId: string): string {
    return orderId.slice(-5);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchDate = '';
    this.filteredOrders = [...this.pedidos];
    this.currentPage = 1;
  }

  openProductsModal(order: Pedido): void {
    this.selectedOrder = order;
    this.showProductsModal = true;
  }

  closeProductsModal(): void {
    this.showProductsModal = false;
    this.selectedOrder = null;
  }

  openDeliveryModal(order: Pedido): void {
    this.selectedOrder = order;
    this.showDeliveryModal = true;
    this.deliveryForm.reset();
  }

  closeDeliveryModal(): void {
    this.showDeliveryModal = false;
    this.selectedOrder = null;
    this.deliveryForm.reset();
  }

  submitDelivery(pedido: Pedido | null) {
    if (pedido) {      
      const entregaPedido: EntregaPedido = {
        pedidoId: pedido.pedidoId,
        estado: this.deliveryForm.value.estado,
        personaQueRecogio: this.deliveryForm.value.recipient,
        observaciones: this.deliveryForm.value.observations
      };

      this.pedidoService.entregarPedido(entregaPedido).subscribe({
        next: (updatedPedido) => {
          console.log('Pedido actualizado:', updatedPedido);
          this.closeDeliveryModal();
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error al actualizar el pedido:', error);
        }
      });
    }
  }

  getAvailableProducts(order: Pedido | null): any[] {
    if (!order) {
      return [];
    }
    return order.productos.filter(p => p.estado.toLowerCase() === 'disponible');
  }

  generateDelivery(pedido: Pedido) {
    // Placeholder for delivery generation logic
    alert(`Funcionalidad para generar entrega para el pedido ${pedido.pedidoId} no implementada.`);
    console.log('Generar entrega para:', pedido);
  }
} 