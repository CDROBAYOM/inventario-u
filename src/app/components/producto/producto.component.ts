import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ProductoService } from './services/producto.services';
import { Producto } from './models/producto.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './producto.component.html',
  styleUrls: []
})

export class ProductoComponent implements OnInit {

  products: Producto[] = [];
  categories: string[] = ['REGIONAL 1', 'REGIONAL 2', 'REGIONAL 3', 'REGIONAL 4', 'REGIONAL 5', 'GERENCIA'];
  showModal: boolean = false;
  showViewModal: boolean = false;
  isLoading: boolean = false;
  userMessage: string = '';
  previewUrl: string | null = null;
  selectedFile: File | null = null;

  productForm: FormGroup;

  // Inicializa el nuevo producto con los tipos correctos
  newProduct: Producto = {
    productoId: '', // El ID se generará en el backend
    nombre: '',
    descripcion: '',
    stockActual: 0,
    imagenURL: '', // URL pública de la imagen
    categoria: '',
    estado: 'DISPONIBLE'
  };

  isEditing: boolean = false;
  selectedProduct: Producto | null = null;

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      stockActual: [0, [Validators.required, Validators.min(0)]],
      estado: ['DISPONIBLE', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.userMessage = 'Cargando productos...';
    this.productoService.getProductos().subscribe({
      next: (productos: Producto[]) => {
        this.products = productos;
        this.userMessage = '';
      },
      error: (error: any) => {
        console.error('Error al cargar productos:', error);
        this.userMessage = 'Error al cargar productos.';
      }
    });
  }

  openAddProductModal(): void {
    this.isEditing = false;
    this.showModal = true;
    this.productForm.reset({
      estado: 'DISPONIBLE',
      stockActual: 0
    });
    this.previewUrl = null;
    this.selectedFile = null;
    this.selectedProduct = null;
  }

  openEditProductModal(product: Producto): void {
    this.isEditing = true;
    this.selectedProduct = product;
    this.productForm.patchValue({
      nombre: product.nombre,
      descripcion: product.descripcion,
      categoria: product.categoria,
      stockActual: product.stockActual,
      estado: product.estado
    });    
    this.previewUrl = product.imagenURL;
    this.selectedFile = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.productForm.reset();
    this.previewUrl = null;
    this.isEditing = false;
    this.selectedFile = null;
    this.selectedProduct = null;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedProduct = null;
  }

  viewProduct(product: Producto): void {
    this.selectedProduct = product;
    this.showViewModal = true;
  }

  editFromView(): void {
    this.closeViewModal();
    if (this.selectedProduct) {
      this.openEditProductModal(this.selectedProduct);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isLoading = true;
      const formData = new FormData();

      // Append form values
      Object.keys(this.productForm.value).forEach(key => {
        formData.append(key, this.productForm.value[key]);
      });

      // Append file if selected
      if (this.selectedFile) {
        formData.append('imagen', this.selectedFile);
      }

      const productId = this.selectedProduct?.productoId; 
      if (!this.isEditing) {
        this.createProduct(formData);       
      } else if (productId) {
        this.updateProduct(formData, productId);
      }
    }
  }

  handlePopupAction(): void {
    if (this.userMessage.includes('exitosamente')) {
      this.router.navigate(['/productos']);
    }
    this.userMessage = '';
  }

  createProduct(formData: FormData): void {
    this.productoService.createProducto(formData).subscribe({
      next: (response: Producto) => {
        this.userMessage = 'Producto creado exitosamente';
        this.closeModal();
        this.loadProducts();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error al crear producto:', error);
        this.userMessage = 'Error al crear el producto.';
        this.isLoading = false;
      }
    });
  }

  updateProduct(formData: FormData, productId: string): void {
    this.productoService.updateProducto(productId, formData).subscribe({
      next: (response: Producto) => {
        this.userMessage = 'Producto actualizado exitosamente';
        this.closeModal();
        this.loadProducts();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error al actualizar producto:', error);
        this.userMessage = 'Error al actualizar el producto.';
        this.isLoading = false;
      }
    });
  }

  deleteProduct(product: Producto): void {
    if (!confirm(`¿Estás seguro de que deseas eliminar el producto "${product.nombre}"?`)) {
      return;
    }

    this.userMessage = 'Eliminando producto...';

    this.productoService.deleteProducto(product.productoId).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.productoId !== product.productoId);
        this.userMessage = 'Producto eliminado exitosamente.';
        this.resetForm();
      },
      error: (error: any) => {
        console.error('Error al eliminar producto:', error);
        this.userMessage = 'Error al eliminar el producto.';
      }
    });
  }

  resetForm(): void {
    this.productForm.reset({
      estado: 'DISPONIBLE',
      stockActual: 0
    });
    this.previewUrl = null;
    this.selectedFile = null;
    this.selectedProduct = null;
    this.isEditing = false;
  }
}