import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { authGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  { 
    path: 'employees',
    loadChildren: () => import('./features/hrm/hrm.routes').then(m => m.HRM_ROUTES),
    canActivate: [authGuard]
  },
  { 
    path: 'org-chart',
    loadChildren: () => import('./features/org-chart/org-chart.routes').then(m => m.ORG_CHART_ROUTES),
    canActivate: [authGuard]
  },
  { 
    path: 'learning',
    loadChildren: () => import('./features/learning/learning.routes').then(m => m.LEARNING_ROUTES),
    canActivate: [authGuard]
  },
  { 
    path: 'recruitment',
    loadChildren: () => import('./features/recruitment/recruitment.routes').then(m => m.RECRUITMENT_ROUTES),
    canActivate: [authGuard]
  },
  { 
    path: 'performance',
    loadChildren: () => import('./features/performance/performance.routes').then(m => m.PERFORMANCE_ROUTES),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
