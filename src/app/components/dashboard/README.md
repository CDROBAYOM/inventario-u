# Dashboard Component

## Descripción
El componente Dashboard proporciona una vista completa para visualizar y gestionar los informes de stock de productos. Consume el servicio `InformeService` para obtener datos del backend y presenta la información de manera organizada y visualmente atractiva.

## Características

### 📊 Estadísticas en Tiempo Real
- **Total de Productos**: Muestra el número total de productos en el inventario
- **Productos Disponibles**: Cuenta productos con estado "disponible"
- **Bajo Stock**: Identifica productos con stock bajo
- **Productos Agotados**: Muestra productos sin stock

### 🔍 Filtros y Búsqueda
- **Búsqueda por nombre**: Filtra productos por nombre
- **Filtro por estado**: Permite filtrar por estado del producto (disponible, bajo stock, agotado)
- **Filtros combinados**: Los filtros funcionan de manera combinada

### 📋 Tabla de Datos
- **Información detallada**: Muestra nombre, estado y stock actual de cada producto
- **Estados visuales**: Badges de colores para identificar rápidamente el estado
- **Acciones**: Botones para ver detalles y editar productos
- **Responsive**: Se adapta a diferentes tamaños de pantalla

### 🎨 Diseño Moderno
- **Cards de estadísticas**: Diseño atractivo con iconos y colores
- **Gradientes**: Uso de gradientes para mejorar la apariencia visual
- **Animaciones**: Efectos hover y transiciones suaves
- **Responsive**: Diseño adaptativo para móviles y tablets

## Estructura de Archivos

```
dashboard/
├── dashboard.component.ts          # Lógica del componente
├── dashboard.component.html        # Template HTML
├── dashboard.component.css         # Estilos CSS
├── models/
│   └── informeStock.models.ts     # Interfaces de datos
├── services/
│   └── informe.services.ts         # Servicio de datos
└── README.md                       # Esta documentación
```

## Uso

### Enrutamiento
El componente está configurado en las rutas de la aplicación:
```typescript
{ 
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard]
}
```

### Navegación
Se puede acceder desde el menú lateral de navegación con el enlace "Dashboard".

## Servicios Utilizados

### InformeService
- **Método**: `getInformes()`
- **Retorna**: `Observable<InformeStock[]>`
- **Endpoint**: `${environment.apiUrl}/informes/stock`

## Modelos de Datos

### InformeStock
```typescript
export interface InformeStock {
  nombre: string;      // Nombre del producto
  estado: string;      // Estado del stock
  stockActual: string; // Cantidad actual en stock
}
```

## Funcionalidades

### Métodos Principales
- `loadInformes()`: Carga los datos del servicio
- `filterInformes()`: Aplica filtros de búsqueda
- `getDisponiblesCount()`: Cuenta productos disponibles
- `getBajoStockCount()`: Cuenta productos con bajo stock
- `getAgotadosCount()`: Cuenta productos agotados
- `getEstadosUnicos()`: Obtiene estados únicos para el filtro
- `getEstadoClass()`: Retorna clase CSS según el estado
- `refreshData()`: Recarga los datos

### Estados de Carga
- **Loading**: Muestra spinner mientras carga
- **Error**: Muestra mensaje de error con opción de reintentar
- **Empty**: Muestra estado vacío cuando no hay resultados
- **Success**: Muestra los datos en la tabla

## Estilos CSS

### Clases Principales
- `.dashboard-container`: Contenedor principal
- `.stats-grid`: Grid de tarjetas de estadísticas
- `.stat-card`: Tarjeta individual de estadística
- `.filters-section`: Sección de filtros
- `.data-table`: Tabla de datos
- `.estado-badge`: Badges de estado

### Estados Visuales
- `.estado-disponible`: Verde para productos disponibles
- `.estado-bajo-stock`: Naranja para bajo stock
- `.estado-agotado`: Rojo para productos agotados

## Responsive Design

### Breakpoints
- **Desktop**: Layout completo con sidebar
- **Tablet**: Ajustes en grid y filtros
- **Mobile**: Layout vertical, filtros apilados

### Características Mobile
- Filtros en columna única
- Tabla con scroll horizontal
- Botones de acción apilados
- Cards de estadísticas en columna

## Dependencias

### Angular
- `@angular/core`: Componente base
- `@angular/common`: Directivas comunes
- `@angular/forms`: Two-way binding

### Servicios
- `InformeService`: Para obtener datos
- `AuthService`: Para autenticación (guard)

### Estilos
- Font Awesome: Iconos
- CSS Grid y Flexbox: Layout
- CSS Variables: Temas

## Mejoras Futuras

### Funcionalidades Sugeridas
- [ ] Exportar datos a Excel/PDF
- [ ] Gráficos y visualizaciones
- [ ] Notificaciones de stock bajo
- [ ] Historial de cambios
- [ ] Filtros avanzados
- [ ] Paginación para grandes volúmenes

### Optimizaciones
- [ ] Lazy loading de datos
- [ ] Caché de resultados
- [ ] Virtual scrolling para tablas grandes
- [ ] Compresión de CSS

## Troubleshooting

### Problemas Comunes
1. **Datos no cargan**: Verificar conexión al backend
2. **Filtros no funcionan**: Revisar método `filterInformes()`
3. **Estilos no aplican**: Verificar importación de CSS
4. **Errores de compilación**: Revisar sintaxis de template

### Debug
- Usar `console.log()` en métodos del componente
- Verificar Network tab en DevTools
- Revisar Angular DevTools para estado del componente
