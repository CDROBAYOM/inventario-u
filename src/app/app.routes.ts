import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PedidoComponent } from './components/pedido/pedido.component';
import { SolicitudesComponent } from './components/solicitudes/solicitudes.component';
import { ProductoComponent } from './components/producto/producto.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'pedidos',
    component: PedidoComponent,
    canActivate: [authGuard]
  },
  {
    path: 'orders',
    component: SolicitudesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'products',
    component: ProductoComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
