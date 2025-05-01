// pedido.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductoService } from '../producto/services/producto.services';
import { Producto } from '../producto/models/producto.model';
import { Pedido } from './models/pedido.models';
import { Router } from '@angular/router';
import { CartItem } from './models/CartItem.models';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class PedidoComponent implements OnInit {
  items: Pedido[] = [];
  filteredItems: Pedido[] = [];
  cartItems: CartItem[] = [];
  categories: string[] = [];
  selectedCategory: string | null = null;
  searchTerm: string = '';
  isCartOpen: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  showSuccessPopup: boolean = false;
  itemQuantities: { [key: string]: number } = {};
  isMenuOpen = false;
  isMobile = false;
  products: Producto[] = [];
  userMessage: string = '';

  constructor(private productoService: ProductoService, private router: Router) {}

  ngOnInit(): void {    
    this.loadInventory();
  }

  loadInventory(): void {    
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.products = productos;
        this.userMessage = '';
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.userMessage = 'Error al cargar productos.';
      }
    })
  }
  
  getItemQuantity(product: Producto): number {
    return this.itemQuantities[product.productoId] || 0;
  }

  increaseQuantity(product: Producto): void {
    if (!this.itemQuantities[product.productoId]) {
      this.itemQuantities[product.productoId] = 0;
    }
    if (this.itemQuantities[product.productoId] < product.stockActual) {
      this.itemQuantities[product.productoId]++;
    }
  }

  decreaseQuantity(product: Producto): void {
    if (this.itemQuantities[product.productoId] > 0) {
      this.itemQuantities[product.productoId]--;
    }
  }

  addToCart(product: Producto): void {
    const quantity = this.getItemQuantity(product);
    if (quantity > 0) {
      const cartItem: CartItem = {
        productoId: product.productoId,
        nombre: product.nombre,
        descripcion: product.descripcion,
        stockActual: product.stockActual,
        imagenURL: product.imagenURL,
        categoria: product.categoria,
        estado: product.estado,
        selectedQuantity: quantity
      };
      this.cartItems.push(cartItem);
      this.itemQuantities[product.productoId] = 0;
    }
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  removeFromCart(item: CartItem): void {
    this.cartItems = this.cartItems.filter(i => i.productoId !== item.productoId);
  }

  checkout(): void {
    if (this.cartItems.length === 0) return;    
    // Aquí iría la lógica para procesar el pedido
    this.userMessage = 'Pedido realizado exitosamente';
    this.cartItems = [];
    this.isCartOpen = false;
  }

  handlePopupAction(): void {
    this.userMessage = '';
  }
}