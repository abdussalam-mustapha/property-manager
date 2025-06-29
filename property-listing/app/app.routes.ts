import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: AuthComponent },
  { 
    path: 'properties', 
    component: PropertyListComponent, 
    canActivate: [authGuard] 
  },
  { path: '**', redirectTo: '' } 
];
