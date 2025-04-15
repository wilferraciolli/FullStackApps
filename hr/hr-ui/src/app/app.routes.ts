import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'employees',
    loadChildren: () => import('./features/hrm/hrm.routes').then(m => m.HRM_ROUTES)
  },
  { 
    path: 'org-chart',
    loadChildren: () => import('./features/org-chart/org-chart.routes').then(m => m.ORG_CHART_ROUTES)
  },
  { 
    path: 'learning',
    loadChildren: () => import('./features/learning/learning.routes').then(m => m.LEARNING_ROUTES)
  },
  { 
    path: 'recruitment',
    loadChildren: () => import('./features/recruitment/recruitment.routes').then(m => m.RECRUITMENT_ROUTES)
  },
  { 
    path: 'performance',
    loadChildren: () => import('./features/performance/performance.routes').then(m => m.PERFORMANCE_ROUTES)
  },
  { path: '**', redirectTo: '' }
];
