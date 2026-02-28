import { Routes } from '@angular/router';
import { Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { authGuard } from './shared/guards/auth.guard';
import { roleGuard } from './shared/guards/role.guard';

import { PortalSelectorComponent } from './components/portal-selector.component';
import { UnauthorizedComponent } from './components/auth/unauthorized.component';
import { LoginComponent } from './components/auth/login.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: '', component: PortalSelectorComponent },
];
