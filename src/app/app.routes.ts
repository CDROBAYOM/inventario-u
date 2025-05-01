import { Routes } from '@angular/router';
import { PedidoComponent } from './components/pedido/pedido.component';
import { SolicitudesComponent } from './components/solicitudes/solicitudes.component';
import { ProductoComponent } from './components/producto/producto.component';

export const routes: Routes = [
  {
    path: '',
    component: PedidoComponent,
    pathMatch: 'full'
  },
  {
    path: 'orders',
    component: SolicitudesComponent
  },
  {
    path: 'products',
    component: ProductoComponent
  }
];
