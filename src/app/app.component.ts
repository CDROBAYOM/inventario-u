import { Component } from '@angular/core';
import { InventoryComponent } from './inventory/inventory.component';

@Component({
  selector: 'app-root',
  imports: [InventoryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
