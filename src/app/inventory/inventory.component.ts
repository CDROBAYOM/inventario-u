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
      { id: 1, name: 'Laptop', category: 'Electronics', quantity: 10, image: 'assets/images/laptop.jpg'},
      { id: 2, name: 'Mouse', category: 'Electronics', quantity: 20, image: 'assets/images/mouse.jpg'},
      { id: 3, name: 'Keyboard', category: 'Electronics', quantity: 15, image: 'assets/images/keyboard.jpg'},
      { id: 4, name: 'T-Shirt', category: 'Clothing', quantity: 50, image: 'assets/images/t-shirt.jpg' },
      { id: 5, name: 'Jeans', category: 'Clothing', quantity: 30, image: 'assets/images/jeans.png' },
      { id: 6, name: 'The Lord of the Rings', category: 'Books', quantity: 5, image: 'assets/images/the_lord_of_the_rings.gif' },
      { id: 7, name: 'Harry Potter', category: 'Books', quantity: 8, image: 'assets/images/harry_potter.jpg'},
      { id: 8, name: 'Table', category: 'Home', quantity: 3, image: 'assets/images/table.jpg'},
      { id: 9, name: 'Chair', category: 'Home', quantity: 12, image: 'assets/images/chair.jpg'},
      { id: 10, name: 'Charger', category: 'Electronics', quantity: 40, image: 'assets/images/charger.jpg'},
    ];

    this.inventoryItems.forEach(item => {
        this.itemQuantities[item.id] = 1;
    });

    this.filterItems();
  }  
  selectCategory(category: string | null) {
    this.selectedCategory = category;
    this.filterItems();
    if (window.innerWidth < 768) {
      this.toggleMobileMenu();
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

  addToBag(item: InventoryItem): void {
    const selectedQuantity = this.itemQuantities[item.id] || 1;
  
    const existingItemIndex = this.shoppingBag.findIndex((i) => i.id === item.id);
    if (existingItemIndex !== -1) {
        this.shoppingBag[existingItemIndex].quantity += selectedQuantity;
    } else {
        this.shoppingBag.push({ ...item, quantity: selectedQuantity });
      }
  
      this.itemQuantities[item.id] = 1;
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