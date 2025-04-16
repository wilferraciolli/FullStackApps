import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  }
  // Add other auth routes like register, forgot-password, etc. as needed
]; 