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


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class InventoryComponent implements OnInit {
  categories: string[] = [
    'Electronics',
    'Clothing',
    'Books',
    'Home',
  ];
  inventoryItems: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  shoppingBag: InventoryItem[] = [];
  selectedCategory: string | null = null;
  searchTerm: string = '';
  itemQuantities: { [key: number]: number } = {};

  ngOnInit(): void {
    this.inventoryItems = [
      { id: 1, name: 'Laptop', category: 'Electronics', quantity: 10, image: 'assets/images/laptop.jpg'}, /* OK */
      { id: 2, name: 'Mouse', category: 'Electronics', quantity: 20, image: 'assets/images/mouse.jpg'}, /* OK */
      { id: 3, name: 'Keyboard', category: 'Electronics', quantity: 15, image: 'assets/images/keyboard.jpg'}, /* OK */
      { id: 4, name: 'Table', category: 'Home', quantity: 3, image: 'assets/images/table.jpg'}, /* OK */      
      { id: 5, name: 'Charger', category: 'Electronics', quantity: 40, image: 'assets/images/charger.jpg'}, /* OK */
    ];

    this.inventoryItems.forEach(item => {
        this.itemQuantities[item.id] = 1;
    });

    this.filterItems();
  }

  getQuantityOptions(quantity: number): number[] {
    return Array.from({length: quantity}, (_, i) => i + 1);
  }

  addToBag(item: InventoryItem): void {
    const quantity = this.itemQuantities[item.id];
    if (quantity > 0 && quantity <= item.quantity) {
      this.shoppingBag.push({...item, quantity: quantity});
      item.quantity -= quantity;
      this.filterItems();
    }
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

  selectCategory(category: string | null) {
    this.selectedCategory = category;
    this.filterItems();
  }

  toggleMobileMenu(): void {
    // Implementación del menú móvil si es necesario
    console.log('Toggle mobile menu');
  }

  removeItem(item: InventoryItem): void {
    const index = this.shoppingBag.indexOf(item);
    if (index > -1) {
      this.shoppingBag.splice(index, 1);
    }
  }

  searchItems() {
    this.filterItems();
  }

  clearSearch() {
    this.searchTerm = '';
    this.filterItems();
  }  
}