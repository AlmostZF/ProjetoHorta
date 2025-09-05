import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: '',
    loadComponent: () =>
      import('./components/header/header.component').then((m) => m.HeaderComponent),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/initial-page/initial-page.component').then((m) => m.InitialPageComponent),
      },
    ],
  },

  {
    path: 'footer',
    loadComponent: () =>
      import('./components/footer/footer.component').then((m) => m.FooterComponent),
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
];
