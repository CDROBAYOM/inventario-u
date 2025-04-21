// inventory.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

type Category = string;

export interface InventoryItem {
  _id: number;
  name: string;
  category: string;
  quantity: number;
  image: string;
}

export interface CartItem extends InventoryItem {
  selectedQuantity: number;
}

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class InventoryComponent implements OnInit {
  categories: string[] = [];
  inventoryItems: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  cartItems: CartItem[] = [];
  selectedCategory: string | null = null;
  searchTerm: string = '';
  itemQuantities: { [key: number]: number } = {};
  isMenuOpen = false;
  isMobile = false;
  isCartOpen = false;
  showSuccessPopup = false;
  isLoading = true;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
    this.loadInventory();
  }

  loadInventory(): void {
    this.isLoading = true;
    this.http.get<InventoryItem[]>('http://localhost:3000/api/inventory')
      .subscribe({
        next: (items) => {
          this.inventoryItems = items;
          this.categories = [...new Set(items.map(item => item.category))];
          this.inventoryItems.forEach(item => {
            this.itemQuantities[item._id] = 1;
          });
          this.filterItems();
          this.isLoading = false;
          console.log('inventoryItems', this.inventoryItems);
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
    this.filterItems();
    if (this.isMobile) {
      this.isMenuOpen = false;
    }
  }

  getQuantityOptions(quantity: number): number[] {
    return Array.from({length: quantity}, (_, i) => i + 1);
  }

  addToCart(item: InventoryItem): void {
    console.log('addToCart', item);
    console.log('idItem', item._id);
    const quantity = this.itemQuantities[item._id];
    if (quantity > 0 && quantity <= item.quantity) {
      const existingItem = this.cartItems.find(cartItem => cartItem._id === item._id);
      
      if (existingItem) {
        console.log('existingItem', existingItem);
        existingItem.selectedQuantity += quantity;
        existingItem.quantity -= quantity;
      } else {
        this.cartItems.push({
          ...item,
          selectedQuantity: quantity,
          quantity: item.quantity - quantity
        });
        console.log('cartItems', this.cartItems);
      }
      
      item.quantity -= quantity;
      this.filterItems();
    }
  }

  removeFromCart(cartItem: CartItem): void {
    const itemIndex = this.cartItems.findIndex(item => item._id === cartItem._id);
    if (itemIndex !== -1) {
      const originalItem = this.inventoryItems.find(item => item._id === cartItem._id);
      if (originalItem) {
        originalItem.quantity += cartItem.selectedQuantity;
        this.updateInventoryItemQuantity(originalItem._id, originalItem.quantity);
      }
      this.cartItems.splice(itemIndex, 1);
      this.filterItems();
    }
  }

  updateCartItemQuantity(cartItem: CartItem, newQuantity: number): void {
    const originalItem = this.inventoryItems.find(item => item._id === cartItem._id);
    if (originalItem) {
      const quantityDifference = newQuantity - cartItem.selectedQuantity;
      if (originalItem.quantity >= quantityDifference) {
        cartItem.selectedQuantity = newQuantity;
        originalItem.quantity -= quantityDifference;
        this.updateInventoryItemQuantity(originalItem._id, originalItem.quantity);
        this.filterItems();
      }
    }
  }

  increaseQuantity(cartItem: CartItem): void {
    const newQuantity = cartItem.selectedQuantity + 1;
    this.updateCartItemQuantity(cartItem, newQuantity);
  }

  decreaseQuantity(cartItem: CartItem): void {
    const newQuantity = cartItem.selectedQuantity - 1;
    this.updateCartItemQuantity(cartItem, newQuantity);
  }

  private updateInventoryItemQuantity(itemId: number, newQuantity: number): void {
    const item = this.inventoryItems.find(i => i._id === itemId);
    if (item) {
      item.quantity = newQuantity;
    }
  }

  getTotalItems(): number {
    const total = this.cartItems.reduce((total, item) => total + item.selectedQuantity, 0);
    return total;
  }

  filterItems() {
    this.filteredItems = this.inventoryItems.filter((item) => {
      const categoryMatch =
        !this.selectedCategory || item.category === this.selectedCategory;
      const searchMatch =
        !this.searchTerm ||
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }

  searchItems() {
    this.filterItems();
  }

  clearSearch() {
    this.searchTerm = '';
    this.filterItems();
  }

  toggleMobileMenu(): void {
    // Implementación del menú móvil si es necesario
    console.log('Toggle mobile menu');
  }

  removeItem(item: InventoryItem): void {
    const index = this.inventoryItems.indexOf(item);
    if (index > -1) {
      this.inventoryItems.splice(index, 1);
    }
  }

  confirmOrder(): void {
    if (this.cartItems.length > 0) {
      const orderData = this.cartItems.map(item => ({
        id: item._id,
        nombre: item.name,
        categoria: item.category,
        cantidadSolicitada: Number(item.selectedQuantity)
      }));

      this.http.post('http://localhost:3000/api/orders', orderData)
        .subscribe({
          next: (response) => {
            console.log('Solicitud enviada exitosamente:', response);
            this.showSuccessPopup = true;
            setTimeout(() => {
              this.showSuccessPopup = false;
              this.cartItems = [];
              this.isCartOpen = false;
            }, 3000);
          },
          error: (error) => {
            console.error('Error al enviar la solicitud:', error);
            console.log('OrderData', orderData);
            this.errorMessage = 'Error al enviar la solicitud. Por favor, intente nuevamente.';
          }
        });
    }
  }

  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
  }
}