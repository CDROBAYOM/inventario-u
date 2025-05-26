// pedido.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductoService } from '../producto/services/producto.services';
import { Producto } from '../producto/models/producto.model';
import { Pedido } from './models/pedido.models';
import { Router } from '@angular/router';
import { CartItem } from './models/cartItem.models'
import { PedidoService } from './services/pedido.services';

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
  filteredProducts: Producto[] = [];

  constructor(private productoService: ProductoService, private router: Router, private pedidoService: PedidoService) {}

  ngOnInit(): void {    
    this.loadInventory();
  }

  loadInventory(): void {    
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.products = productos;
        this.filteredProducts = [...productos];
        this.categories = [...new Set(productos.map(p => p.categoria))];
        this.userMessage = '';
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.userMessage = 'Error al cargar productos.';
      }
    });
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          product.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.selectedCategory || product.categoria === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
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
    const pedido: Pedido = {        
      pedidoId: '',
      cantidad: this.getTotalItems().toString(),
      estado: 'PENDIENTE',
      total: this.getTotalItems(),
      coordinacionId: '',
      categoria: this.cartItems[0].categoria,
      productos: this.cartItems.map(item => ({
        productoId: item.productoId,
        nombre: item.nombre,
        descripcion: item.descripcion,
        stockActual: item.stockActual,
        imagenURL: item.imagenURL,
        categoria: item.categoria,
        estado: item.estado
      })),
      personaQueRecoge: '',
      observaciones: ''
    };
    
    this.pedidoService.createPedido(pedido).subscribe({
      next: (pedido) => {
        this.userMessage = 'Pedido realizado exitosamente';
        // Actualizar el stock de los productos
        this.cartItems.forEach(item => {          
          this.updateProduct(item);
        });
        this.cartItems = [];
        this.isCartOpen = false;
        this.loadInventory();
      },
      error: (error) => {
        this.userMessage = 'Error al realizar el pedido';
      }
    });
  }

  updateProduct(product: CartItem) {
    let formData = new FormData();
    // Actualizar el stock del producto
    formData.append('stockActual', (product.stockActual - product.selectedQuantity).toString());

    // Actualizar el estado del producto
    this.productoService.updateProducto(product.productoId, formData).subscribe({
      next: () => {
        this.userMessage = 'Producto actualizado exitosamente';
        this.loadInventory();
      }
    });
  }
  handlePopupAction(): void {
    this.userMessage = '';
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.selectedQuantity, 0);
  }
}