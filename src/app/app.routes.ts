import { Routes } from '@angular/router';
import { InventoryComponent } from './inventory/inventory.component';
import { OrdersComponent } from './orders/orders.component';

export const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
    pathMatch: 'full'
  },
  {
    path: 'orders',
    component: OrdersComponent
  }
];
