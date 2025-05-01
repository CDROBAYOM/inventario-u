import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // No es necesario si ya está en AppModule o en el servicio
import { ProductoService } from './services/producto.services';
import { Producto } from './models/producto.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // HttpClientModule ya no necesario aquí si solo lo usa el servicio
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})

export class ProductoComponent implements OnInit {

  products: Producto[] = [];

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

  categories: string[] = ['Regional 1', 'Regional 2', 'Regional 3', 'Regional 4'];
  isEditing: boolean = false;
  selectedProduct: Producto | null = null;
  // Variable para mensajes de usuario
  userMessage: string = '';

  // Considera agregar una variable para el archivo de imagen si lo vas a subir
  selectedImageFile: File | null = null;


  constructor(private productoService: ProductoService, private router: Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.userMessage = 'Cargando productos...';
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

  // Nuevo método para manejar tanto la creación como la actualización al guardar
  saveProduct() {
      if (this.isEditing) {
          this.updateProduct();
      } else {
          this.createProduct();
      }
  }

  createProduct() {
      // Validar datos básicos antes de enviar (puedes añadir más validación)
      if (!this.newProduct.nombre || !this.newProduct.categoria) {
          this.userMessage = 'Nombre y Categoría son obligatorios.';
          return;
      }
      
      console.log(this.newProduct.estado);
      console.log(this.newProduct.descripcion);
      
      let formData = new FormData();
      formData.append('nombre', this.newProduct.nombre);
      formData.append('categoria', this.newProduct.categoria);
      formData.append('descripcion', this.newProduct.descripcion);
      formData.append('stockActual', this.newProduct.stockActual.toString());
      formData.append('imagenURL', this.newProduct.imagenURL);
      formData.append('estado', this.newProduct.estado.toString());
            

      if (this.selectedImageFile) {
         formData.append('imagen', this.selectedImageFile, this.selectedImageFile.name);
      }
      
      this.productoService.createProducto(formData).subscribe({
          next: (productoCreado) => {
              this.products.push(productoCreado);
              this.userMessage = 'Producto creado exitosamente.';
              this.resetForm();
          },
          error: (error) => {
              console.error('Error al crear producto:', error);
              this.userMessage = 'Error al crear el producto.';
          }
      });
  }

  updateProduct() {
    
    if (!this.selectedProduct) return;

    // Convertir el objeto Producto a FormData dado que el backend retorna fechas que invalidan la petición
    let formData = new FormData();
    formData.append('nombre', this.newProduct.nombre);
    formData.append('categoria', this.newProduct.categoria);
    formData.append('descripcion', this.newProduct.descripcion);
    formData.append('stockActual', this.newProduct.stockActual.toString());
    formData.append('imagenURL', this.newProduct.imagenURL);
    formData.append('estado', this.newProduct.estado.toString());

    console.log(this.newProduct.estado.toString());

    // Actualizar el producto
    this.productoService.updateProducto(this.selectedProduct.productoId, formData).subscribe({
      error: (error) => {
        console.error('Error al actualizar producto:', error);
        this.userMessage = 'Error al actualizar el producto.';
      }
    });

    // Recargar la pagina
    window.location.reload();
  }

  editProduct(product: Producto) {
    this.isEditing = true;
    this.selectedProduct = product;
    // Copiar los datos del producto al formulario newProduct para editar
    this.newProduct = { ...product };
    this.userMessage = ''; // Limpiar mensajes al iniciar edición
  }

  deleteProduct(product: Producto) {
    console.log(product.productoId);
    if (!confirm(`¿Estás seguro de que deseas eliminar el producto "${product.nombre}"?`)) {        
        return; // Cancelar si el usuario no confirma
    }

    this.userMessage = 'Eliminando producto...';

    this.productoService.deleteProducto(product.productoId).subscribe({
        next: () => {
            // Eliminar el producto de la lista local solo si la API responde exitosamente
            this.products = this.products.filter(p => p.productoId !== product.productoId);
            this.userMessage = 'Producto eliminado exitosamente.';
            this.resetForm(); // Limpiar formulario si el producto eliminado era el seleccionado
        },
        error: (error) => {
            console.error('Error al eliminar producto:', error);
             this.userMessage = 'Error al eliminar el producto.';
        }
    });
  }

  resetForm() {
    this.newProduct = {
      productoId: '',
      nombre: '',
      descripcion: '',
      stockActual: 0,
      imagenURL: '',
      categoria: '',
      estado: 'true'
    };
    this.isEditing = false;
    this.selectedProduct = null;
    this.userMessage = '';
    this.selectedImageFile = null;
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImageFile = input.files[0]; // Guarda el archivo
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Esto es solo para previsualizar la imagen en el formulario
        this.newProduct.imagenURL = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    } else {
      this.selectedImageFile = null;
      this.newProduct.imagenURL = ''; // Limpiar la URL de previsualización si no hay archivo
    }
  }

  handlePopupAction() {
    if (this.userMessage.includes('exitosamente')) {
      // Si fue exitoso, redirigir a la lista de productos
      this.router.navigate(['/productos']);
    } else {
      // Si fue error, limpiar el mensaje
      this.userMessage = '';
    }
  }
}