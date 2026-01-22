import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'products/add',
    loadComponent: () =>
      import('./features/product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
  },
  {
    path: 'products/edit/:id',
    loadComponent: () =>
      import('./features/product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/products.component').then(
        (m) => m.ProductsComponent
      ),
  },
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full',
  },
];