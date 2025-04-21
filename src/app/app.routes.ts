import { Routes } from '@angular/router';
import { InventoryComponent } from './components/inventory/inventory.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductsComponent } from './components/products/products.component';

export const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
    pathMatch: 'full'
  },
  {
    path: 'orders',
    component: OrdersComponent
  },
  {
    path: 'products',
    component: ProductsComponent
  }
];
