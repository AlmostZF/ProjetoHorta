import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/initial-page/initial-page.component').then((m) => m.InitialPageComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup.component').then((m) => m.SignUpComponent),
  },
  {
    path: 'detalhe-compra/:id',
    loadComponent: () =>
      import('./pages/shop-detail/shop-detail.component').then((m) => m.ShopDetailComponent),
  },
  {
    path: 'compra',
    loadComponent: () =>
      import('./pages/shop/shop.component').then((m) => m.ShopComponent),
  },
  {
    path: 'compra/:productType',
    loadComponent: () =>
      import('./pages/shop/shop.component').then((m) => m.ShopComponent),
  },
  {
    path: 'carrinho',
    loadComponent: () =>
      import('./pages/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'endereco',
    loadComponent: () =>
      import('./pages/cart-finish/cart-finish.component').then((m) => m.CartFinishComponent),
  },
  {
    path: 'user',
    loadComponent: () =>
      import('./pages/user/user.component').then((m) => m.UserComponent),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin-components/admin/admin.component').then((m) => m.AdminComponent),
  },
  {
    path: 'admin/produtos',
    loadComponent: () =>
      import('./pages/admin-components/list-products/list-products.component').then((m) => m.ListProductsComponent),
  },
  {
    path: 'admin/vendedor',
    loadComponent: () =>
      import('./pages/admin-components/seller/seller.component').then((m) => m.SellerComponent),
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
