import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  image: string;
  state: boolean;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  newProduct: Product = {
    id: '',
    name: '',
    category: '',
    quantity: 0,
    image: '',
    state: true
  };
  categories: string[] = ['Regional 1', 'Regional 2', 'Regional 3', 'Regional 4'];
  isEditing: boolean = false;
  selectedProduct: Product | null = null;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    // TODO: Implement API call to load products
    // For now, we'll use mock data
    this.products = [
      {
        id: '1',
        name: 'Laptop HP',
        category: 'Regional 1',
        quantity: 5,
        image: 'assets/images/laptop.jpg',
        state: true
      },
      {
        id: '2',
        name: 'Monitor Dell',
        category: 'Regional 2',
        quantity: 10,
        image: 'assets/images/monitor.jpg',
        state: true
      }
    ];
  }

  addProduct() {
    if (this.isEditing && this.selectedProduct) {
      // Update existing product
      const index = this.products.findIndex(p => p.id === this.selectedProduct?.id);
      if (index !== -1) {
        this.products[index] = { ...this.newProduct };
      }
    } else {
      // Add new product
      this.newProduct.id = (this.products.length + 1).toString();
      this.products.push({ ...this.newProduct });
    }
    
    this.resetForm();
  }

  editProduct(product: Product) {
    this.isEditing = true;
    this.selectedProduct = product;
    this.newProduct = { ...product };
  }

  deleteProduct(product: Product) {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.products.splice(index, 1);
    }
  }

  resetForm() {
    this.newProduct = {
      id: '',
      name: '',
      category: '',
      quantity: 0,
      image: '',
      state: true
    };
    this.isEditing = false;
    this.selectedProduct = null;
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newProduct.image = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
} 