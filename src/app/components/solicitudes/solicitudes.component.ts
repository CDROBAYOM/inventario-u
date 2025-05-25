import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PedidoService } from '../pedido/services/pedido.services';
import { Pedido } from '../pedido/models/pedido.models';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css'],
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
        this.pedidos = pedidos;
        this.filteredOrders = [...pedidos];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading orders:', error);
        this.errorMessage = 'Error al cargar los pedidos';
        this.isLoading = false;
      }
    });
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
      this.pedidoService.updatePedido(pedido).subscribe({
        next: (updatedPedido) => {
          console.log('Pedido actualizado:', updatedPedido);
        },
        error: (error) => {
          console.error('Error al actualizar el pedido:', error);
          console.log(pedido);
        }
      });
    }
  }
} 