// inventory.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Category = string;

export interface InventoryItem {
  name: string;
  category: string;
  quantity: number;
  image: string;
  id: number;
}

export interface CartItem extends InventoryItem {
  selectedQuantity: number;
}

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class InventoryComponent implements OnInit {
  categories: string[] = [
    'Regional 1',
    'Regional 2',
    'Regional 3',
    'Regional 4',
    'Regional 5',
  ];
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

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());

    this.inventoryItems = [
      { id: 1, name: 'Laptop', category: 'Regional 1', quantity: 10, image: 'assets/images/laptop.jpg'}, /* OK */
      { id: 2, name: 'Mouse', category: 'Regional 2', quantity: 20, image: 'assets/images/mouse.jpg'}, /* OK */
      { id: 3, name: 'Keyboard', category: 'Regional 3', quantity: 15, image: 'assets/images/keyboard.jpg'}, /* OK */
      { id: 4, name: 'Table', category: 'Regional 4', quantity: 3, image: 'assets/images/table.jpg'}, /* OK */      
      { id: 5, name: 'Charger', category: 'Regional 5', quantity: 40, image: 'assets/images/charger.jpg'}, /* OK */
    ];

    this.inventoryItems.forEach(item => {
        this.itemQuantities[item.id] = 1;
    });

    this.filterItems();
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
    const quantity = this.itemQuantities[item.id];
    if (quantity > 0 && quantity <= item.quantity) {
      const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        existingItem.selectedQuantity += quantity;
        existingItem.quantity -= quantity;
      } else {
        this.cartItems.push({
          ...item,
          selectedQuantity: quantity,
          quantity: item.quantity - quantity
        });
      }
      
      item.quantity -= quantity;
      this.filterItems();
    }
  }

  removeFromCart(cartItem: CartItem): void {
    const itemIndex = this.cartItems.findIndex(item => item.id === cartItem.id);
    if (itemIndex !== -1) {
      const originalItem = this.inventoryItems.find(item => item.id === cartItem.id);
      if (originalItem) {
        originalItem.quantity += cartItem.selectedQuantity;
      }
      this.cartItems.splice(itemIndex, 1);
      this.filterItems();
    }
  }

  updateCartItemQuantity(cartItem: CartItem, newQuantity: number): void {
    const originalItem = this.inventoryItems.find(item => item.id === cartItem.id);
    if (originalItem) {
      const quantityDifference = newQuantity - cartItem.selectedQuantity;
      if (originalItem.quantity >= quantityDifference) {
        cartItem.selectedQuantity = newQuantity;
        originalItem.quantity -= quantityDifference;
        this.filterItems();
      }
    }
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.selectedQuantity, 0);
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
      // Aquí iría la lógica para procesar la orden
      this.showSuccessPopup = true;
      setTimeout(() => {
        this.showSuccessPopup = false;
        this.cartItems = [];
        this.isCartOpen = false;
      }, 3000);
    }
  }

  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
  }
}