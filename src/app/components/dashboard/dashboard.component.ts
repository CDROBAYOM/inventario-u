import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InformeService } from './services/informe.services';
import { InformeStock } from './models/informeStock.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  informes: InformeStock[] = [];
  filteredInformes: InformeStock[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  selectedEstado = '';

  constructor(private informeService: InformeService) {}

  ngOnInit(): void {
    this.loadInformes();
  }

  loadInformes(): void {
    this.loading = true;
    this.error = '';
    
    this.informeService.getInformes().subscribe({
      next: (data) => {
        this.informes = data;
        this.filteredInformes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los informes de stock';
        this.loading = false;
        console.error('Error loading informes:', err);
      }
    });
  }

  filterInformes(): void {
    this.filteredInformes = this.informes.filter(informe => {
      const matchesSearch = !this.searchTerm || 
        informe.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesEstado = !this.selectedEstado || 
        informe.estado === this.selectedEstado;
      
      return matchesSearch && matchesEstado;
    });
  }

  onSearchChange(): void {
    this.filterInformes();
  }

  onEstadoChange(): void {
    this.filterInformes();
  }

  getEstadosUnicos(): string[] {
    return [...new Set(this.informes.map(informe => informe.estado))];
  }

  getDisponiblesCount(): number {
    return this.informes.filter(i => i.estado.toLowerCase() === 'disponible').length;
  }

  getBajoStockCount(): number {
    return this.informes.filter(i => i.estado.toLowerCase() === 'bajo stock').length;
  }

  getAgotadosCount(): number {
    return this.informes.filter(i => i.estado.toLowerCase() === 'agotado').length;
  }

  getEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'disponible':
        return 'estado-disponible';
      case 'agotado':
        return 'estado-agotado';
      case 'bajo stock':
        return 'estado-bajo-stock';
      default:
        return 'estado-default';
    }
  }

  refreshData(): void {
    this.loadInformes();
  }
}
