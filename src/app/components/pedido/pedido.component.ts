// pedido.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface InventoryItem {
  id: number;
  nombre: string;
  descripcion: string;
  stockActual: number;
  imagenURL: string;
  categoria: string;
  estado: string;
}

interface CartItem extends InventoryItem {
  selectedQuantity: number;
}

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class PedidoComponent implements OnInit {
  items: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  cartItems: CartItem[] = [];
  categories: string[] = [];
  selectedCategory: string | null = null;
  searchTerm: string = '';
  isCartOpen: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  showSuccessPopup: boolean = false;
  itemQuantities: { [key: number]: number } = {};
  isMenuOpen = false;
  isMobile = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
    this.loadInventory();
  }

  loadInventory(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.http.get<InventoryItem[]>(`${environment.apiUrl}/productos`)
      .subscribe({
        next: (data) => {
          this.items = data;
          this.filteredItems = [...data];
          this.categories = [...new Set(data.map(item => item.categoria))];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading inventory:', error);
          this.errorMessage = 'Error al cargar el inventario. Por favor, intente nuevamente.';
          this.isLoading = false;
        }
      });
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile) {
      this.isMenuOpen = true;
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  selectCategory(category: string | null): void {
    this.selectedCategory = category;
    if (!category) {
      this.filteredItems = [...this.items];
    } else {
      this.filteredItems = this.items.filter(item => item.categoria === category);
    }
    if (this.isMobile) {
      this.isMenuOpen = false;
    }
  }

  getQuantityOptions(max: number): number[] {
    return Array.from({ length: max }, (_, i) => i + 1);
  }

  addToCart(item: InventoryItem): void {
    const quantity = this.itemQuantities[item.id] || 1;
    const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      if (existingItem.selectedQuantity + quantity <= item.stockActual) {
        existingItem.selectedQuantity += quantity;
      }
    } else {
      this.cartItems.push({
        ...item,
        selectedQuantity: quantity
      });
    }

    this.itemQuantities[item.id] = 1;
  }

  removeFromCart(item: CartItem): void {
    this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
  }

  updateCartItemQuantity(cartItem: CartItem, newQuantity: number): void {
    const item = this.cartItems.find(item => item.id === cartItem.id);
    if (item) {
      item.selectedQuantity = newQuantity;
    }
  }

  increaseQuantity(item: CartItem): void {
    if (item.selectedQuantity < item.stockActual) {
      item.selectedQuantity++;
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.selectedQuantity > 1) {
      item.selectedQuantity--;
    }
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.selectedQuantity, 0);
  }

  searchItems(): void {
    if (!this.searchTerm) {
      this.filteredItems = [...this.items];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      item.nombre.toLowerCase().includes(searchTermLower) ||
      item.descripcion.toLowerCase().includes(searchTermLower) ||
      item.categoria.toLowerCase().includes(searchTermLower)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchItems();
  }

  toggleMobileMenu(): void {
    // Implementación del menú móvil si es necesario
    console.log('Toggle mobile menu');
  }

  removeItem(item: InventoryItem): void {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

  confirmOrder(): void {
    const order = {
      items: this.cartItems.map(item => ({
        productoId: item.id,
        cantidad: item.selectedQuantity
      }))
    };

    this.http.post(`${environment.apiUrl}/solicitudes`, order)
      .subscribe({
        next: () => {
          this.showSuccessPopup = true;
          this.cartItems = [];
          this.loadInventory();
        },
        error: (error) => {
          console.error('Error confirming order:', error);
          alert('Error al confirmar la solicitud. Por favor, intente nuevamente.');
        }
      });
  }

  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
  }
}